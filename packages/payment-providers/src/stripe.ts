import {
  createMoney,
  type CreateCheckoutSessionRequest,
  type CreatePaymentRequest,
  type PaymentAttempt,
  type PaymentProviderAdapter,
  type ProviderWebhookEvent,
  type Refund,
  type RefundPaymentRequest,
  type CapturePaymentRequest,
  type CancelPaymentRequest,
} from "@puzzle-ui/commerce";
import {
  asString,
  createProviderError,
  encodeBasicAuth,
  jsonHeaders,
  now,
  requestJson,
  requireString,
  type ProviderFetcher,
} from "./http";
import { verifyStripeSignature } from "./signatures";

export type StripeAdapterOptions = {
  readonly secretKey: string;
  readonly webhookSecret?: string;
  readonly apiBaseUrl?: string;
  readonly fetcher?: ProviderFetcher;
  readonly webhookToleranceSeconds?: number;
};

const provider = "stripe";

const getAmount = (value: unknown, currency: string) =>
  createMoney(
    typeof value === "number" && Number.isSafeInteger(value) ? value : 0,
    currency,
  );

const paymentFromIntent = (
  value: Record<string, unknown>,
  fallback: Pick<PaymentAttempt, "id" | "orderId" | "amount">,
): PaymentAttempt => {
  const currency = String(value.currency ?? fallback.amount.currency).toUpperCase();
  const status = String(value.status ?? "pending");
  const normalizedStatus: PaymentAttempt["status"] =
    status === "requires_action"
      ? "requires_action"
      : status === "processing"
        ? "processing"
        : status === "succeeded"
          ? "succeeded"
          : status === "canceled"
            ? "cancelled"
            : status === "requires_payment_method" || status === "requires_confirmation"
              ? "pending"
              : "pending";
  const amount = getAmount(value.amount, currency);
  const captured = getAmount(value.amount_received, currency);
  return {
    id: fallback.id,
    orderId: fallback.orderId,
    amount,
    status: normalizedStatus,
    provider,
    providerPaymentId: requireString(value.id, "payment ID"),
    capturedAmount: captured.amount > 0 ? captured : undefined,
    failure:
      typeof value.last_payment_error === "object" && value.last_payment_error
        ? {
            code: "declined",
            message: String(
              (value.last_payment_error as Record<string, unknown>).message ??
                "Payment was declined.",
            ),
            providerCode: asString(
              (value.last_payment_error as Record<string, unknown>).code,
            ),
            retryable: false,
            decline: true,
          }
        : undefined,
    createdAt:
      typeof value.created === "number"
        ? new Date(value.created * 1000)
        : fallback.amount
          ? now()
          : undefined,
    updatedAt: now(),
  };
};

const formBody = (values: Readonly<Record<string, string | number | undefined>>) =>
  new URLSearchParams(
    Object.entries(values).filter(([, value]) => value !== undefined) as [
      string,
      string,
    ][],
  ).toString();

export const createStripeAdapter = (
  options: StripeAdapterOptions,
): PaymentProviderAdapter => {
  if (!options.secretKey.trim()) throw new TypeError("Stripe secret key is required.");
  const fetcher = options.fetcher ?? fetch;
  const baseUrl = options.apiBaseUrl ?? "https://api.stripe.com";
  const headers = (idempotencyKey?: string): HeadersInit => ({
    ...jsonHeaders(),
    Authorization: encodeBasicAuth(options.secretKey),
    ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
  });

  const request = async (
    path: string,
    init: RequestInit = {},
    idempotencyKey?: string,
  ) => {
    try {
      return await requestJson(fetcher, `${baseUrl}${path}`, {
        ...init,
        headers: { ...headers(idempotencyKey), ...init.headers },
      });
    } catch (error) {
      throw createProviderError(error);
    }
  };

  const createIntent = async (
    input: CreatePaymentRequest,
    idempotencyKey?: string,
  ) => {
    const body = formBody({
      amount: input.amount.amount,
      currency: input.amount.currency.toLowerCase(),
      "metadata[order_id]": input.orderId,
      "payment_method_options[card][request_three_d_secure]": "automatic",
    });
    const intent = await request(
      "/v1/payment_intents",
      { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      idempotencyKey,
    );
    return paymentFromIntent(intent, {
      id: input.paymentId,
      orderId: input.orderId,
      amount: input.amount,
    });
  };

  return {
    id: provider,
    name: "Stripe",
    capabilities: {
      payments: true,
      refunds: true,
      authorize: true,
      capture: true,
      cancel: true,
      partialCapture: true,
      partialRefund: true,
      recurring: true,
      hostedCheckout: true,
      embeddedCheckout: true,
      wallets: true,
      delayedPaymentMethods: true,
      webhooks: Boolean(options.webhookSecret),
      idempotency: true,
    },
    createPayment: (input, context) =>
      createIntent(input, context?.idempotencyKey),
    getPayment: async (providerPaymentId, context) => {
      const intent = await request(
        `/v1/payment_intents/${encodeURIComponent(providerPaymentId)}`,
        { method: "GET" },
        context?.idempotencyKey,
      );
      return paymentFromIntent(intent, {
        id: providerPaymentId,
        orderId: String(
          (intent.metadata as Record<string, unknown> | undefined)?.order_id ?? "",
        ),
        amount: getAmount(intent.amount, String(intent.currency ?? "USD").toUpperCase()),
      });
    },
    authorize: async ({ payment, context }) => {
      const intent = await request(
        `/v1/payment_intents/${encodeURIComponent(requireString(payment.providerPaymentId, "provider payment ID"))}/confirm`,
        { method: "POST" },
        context?.idempotencyKey,
      );
      return paymentFromIntent(intent, payment);
    },
    capture: async ({ payment, amount, context }: CapturePaymentRequest) => {
      const intent = await request(
        `/v1/payment_intents/${encodeURIComponent(requireString(payment.providerPaymentId, "provider payment ID"))}/capture`,
        {
          method: "POST",
          body: formBody({ amount_to_capture: amount?.amount }),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
        context?.idempotencyKey,
      );
      return paymentFromIntent(intent, payment);
    },
    cancel: async ({ payment, context }: CancelPaymentRequest) => {
      const intent = await request(
        `/v1/payment_intents/${encodeURIComponent(requireString(payment.providerPaymentId, "provider payment ID"))}/cancel`,
        { method: "POST" },
        context?.idempotencyKey,
      );
      return paymentFromIntent(intent, payment);
    },
    refund: async ({ payment, refund, context }: RefundPaymentRequest) => {
      const result = await request(
        "/v1/refunds",
        {
          method: "POST",
          body: formBody({
            payment_intent: requireString(payment.providerPaymentId, "provider payment ID"),
            amount: refund.amount.amount,
            reason: refund.reason,
          }),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
        context?.idempotencyKey,
      );
      return {
        ...refund,
        providerRefundId: requireString(result.id, "refund ID"),
        status:
          result.status === "succeeded"
            ? "succeeded"
            : result.status === "failed"
              ? "failed"
              : "pending",
        updatedAt: now(),
      };
    },
    createCheckoutSession: async (input: CreateCheckoutSessionRequest, context) => {
      const session = await request(
        "/v1/checkout/sessions",
        {
          method: "POST",
          body: formBody({
            mode: input.mode ?? "payment",
            success_url: input.returnUrl,
            cancel_url: input.cancelUrl,
            "line_items[0][price_data][currency]": input.amount.currency.toLowerCase(),
            "line_items[0][price_data][product_data][name]": `Order ${input.orderId}`,
            "line_items[0][price_data][unit_amount]": input.amount.amount,
            "line_items[0][quantity]": 1,
          }),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
        context?.idempotencyKey,
      );
      return {
        id: requireString(session.id, "checkout session ID"),
        provider,
        paymentId: input.paymentId,
        url: asString(session.url),
        clientSecret: asString(session.client_secret),
        expiresAt:
          typeof session.expires_at === "number"
            ? new Date(session.expires_at * 1000)
            : undefined,
      };
    },
    getSupportedPaymentMethods: async () => [
      { id: "card", type: "card", label: "Card", provider },
      { id: "wallet", type: "wallet", label: "Wallet", provider },
    ],
    verifyWebhook: async (payload, signature, secret) =>
      verifyStripeSignature({
        payload: typeof payload === "string" ? payload : new TextDecoder().decode(payload),
        signature,
        secret,
        toleranceSeconds: options.webhookToleranceSeconds,
      }),
    parseWebhook: (payload): ProviderWebhookEvent => {
      const event = payload as Record<string, unknown>;
      const data = (event.data as Record<string, unknown> | undefined)?.object;
      const object = data as Record<string, unknown> | undefined;
      return {
        id: requireString(event.id, "webhook event ID"),
        type: requireString(event.type, "webhook event type"),
        paymentId:
          asString(object?.payment_intent) ??
          (asString(object?.object) === "payment_intent" ? asString(object?.id) : undefined),
        data: object ?? data ?? event,
        occurredAt:
          typeof event.created === "number"
            ? new Date(event.created * 1000)
            : now(),
      };
    },
  };
};
