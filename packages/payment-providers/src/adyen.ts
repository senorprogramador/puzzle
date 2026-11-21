import {
  createMoney,
  type CreateCheckoutSessionRequest,
  type PaymentProviderAdapter,
  type PaymentAttempt,
  type ProviderWebhookEvent,
  type RefundPaymentRequest,
} from "@puzzle-ui/commerce";
import {
  asString,
  createProviderError,
  jsonHeaders,
  now,
  requestJson,
  requireString,
  type ProviderFetcher,
} from "./http";
import { verifyHmacSha256 } from "./signatures";

export type AdyenAdapterOptions = {
  readonly apiKey: string;
  readonly merchantAccount: string;
  readonly apiBaseUrl?: string;
  readonly apiVersion?: string;
  readonly fetcher?: ProviderFetcher;
};

const provider = "adyen";

const paymentFromAdyen = (
  value: Record<string, unknown>,
  fallback: Pick<PaymentAttempt, "id" | "orderId" | "amount">,
): PaymentAttempt => {
  const resultCode = String(value.resultCode ?? value.status ?? "Received");
  const normalized: PaymentAttempt["status"] =
    resultCode === "Authorised" || resultCode === "Captured"
      ? "authorized"
      : resultCode === "PresentToShopper" ||
          resultCode === "IdentifyShopper" ||
          resultCode === "ChallengeShopper"
        ? "requires_action"
        : resultCode === "Refused" || resultCode === "Error"
          ? "failed"
          : resultCode === "Cancelled"
            ? "cancelled"
            : "processing";
  const amountValue = (value.amount as Record<string, unknown> | undefined)?.value;
  const currency = String(
    (value.amount as Record<string, unknown> | undefined)?.currency ??
      fallback.amount.currency,
  ).toUpperCase();
  const amount = createMoney(
    typeof amountValue === "number" && Number.isSafeInteger(amountValue)
      ? amountValue
      : fallback.amount.amount,
    currency,
  );
  const pspReference = asString(value.pspReference) ?? asString(value.id);
  return {
    id: fallback.id,
    orderId: fallback.orderId,
    amount,
    status: normalized,
    provider,
    providerPaymentId: pspReference,
    capturedAmount: resultCode === "Captured" ? amount : undefined,
    failure:
      normalized === "failed"
        ? {
            code: "declined",
            message: String(value.refusalReason ?? "Adyen payment was refused."),
            providerCode: asString(value.refusalReasonCode),
            retryable: false,
            decline: true,
          }
        : undefined,
    createdAt: now(),
    updatedAt: now(),
  };
};

const notificationItem = (payload: unknown) => {
  const root = payload as Record<string, unknown>;
  const items = Array.isArray(root.notificationItems) ? root.notificationItems : [];
  return (items[0] as Record<string, unknown> | undefined)?.NotificationRequestItem as
    | Record<string, unknown>
    | undefined;
};

export const createAdyenAdapter = (
  options: AdyenAdapterOptions,
): PaymentProviderAdapter => {
  if (!options.apiKey.trim() || !options.merchantAccount.trim()) {
    throw new TypeError("Adyen API key and merchant account are required.");
  }
  const fetcher = options.fetcher ?? fetch;
  const baseUrl = options.apiBaseUrl ?? "https://checkout-live.adyen.com";
  const version = options.apiVersion ?? "v71";
  const request = async (path: string, init: RequestInit = {}) => {
    try {
      return await requestJson(fetcher, `${baseUrl}/${version}${path}`, {
        ...init,
        headers: {
          ...jsonHeaders({ "X-API-Key": options.apiKey }),
          ...init.headers,
        },
      });
    } catch (error) {
      throw createProviderError(error);
    }
  };

  return {
    id: provider,
    name: "Adyen",
    capabilities: {
      payments: true,
      refunds: true,
      capture: true,
      cancel: true,
      partialCapture: true,
      partialRefund: true,
      hostedCheckout: true,
      embeddedCheckout: true,
      wallets: true,
      delayedPaymentMethods: true,
      webhooks: true,
      idempotency: true,
    },
    createPayment: async (input, context) => {
      const result = await request(
        "/payments",
        {
          method: "POST",
          headers: context?.idempotencyKey
            ? { "Idempotency-Key": context.idempotencyKey }
            : undefined,
          body: JSON.stringify({
            merchantAccount: options.merchantAccount,
            reference: input.orderId,
            amount: {
              currency: input.amount.currency,
              value: input.amount.amount,
            },
            returnUrl: input.returnUrl,
            channel: "Web",
            shopperInteraction: "Ecommerce",
            metadata: input.metadata,
          }),
        },
      );
      return paymentFromAdyen(result, {
        id: input.paymentId,
        orderId: input.orderId,
        amount: input.amount,
      });
    },
    getPayment: async (providerPaymentId) => {
      const result = await request(`/payments/${encodeURIComponent(providerPaymentId)}`);
      return paymentFromAdyen(result, {
        id: providerPaymentId,
        orderId: String(result.reference ?? ""),
        amount: createMoney(
          Number((result.amount as Record<string, unknown> | undefined)?.value ?? 0),
          String((result.amount as Record<string, unknown> | undefined)?.currency ?? "EUR"),
        ),
      });
    },
    capture: async ({ payment, amount, context }) => {
      const result = await request(
        `/payments/${encodeURIComponent(requireString(payment.providerPaymentId, "provider payment ID"))}/captures`,
        {
          method: "POST",
          headers: context?.idempotencyKey
            ? { "Idempotency-Key": context.idempotencyKey }
            : undefined,
          body: JSON.stringify({
            merchantAccount: options.merchantAccount,
            reference: payment.id,
            ...(amount
              ? { amount: { currency: amount.currency, value: amount.amount } }
              : {}),
          }),
        },
      );
      return paymentFromAdyen({ ...result, resultCode: "Captured" }, payment);
    },
    cancel: async ({ payment, context }) => {
      const result = await request(
        `/payments/${encodeURIComponent(requireString(payment.providerPaymentId, "provider payment ID"))}/cancels`,
        {
          method: "POST",
          headers: context?.idempotencyKey
            ? { "Idempotency-Key": context.idempotencyKey }
            : undefined,
          body: JSON.stringify({ merchantAccount: options.merchantAccount }),
        },
      );
      return paymentFromAdyen({ ...result, resultCode: "Cancelled" }, payment);
    },
    refund: async ({ payment, refund, context }: RefundPaymentRequest) => {
      const result = await request(
        `/payments/${encodeURIComponent(requireString(payment.providerPaymentId, "provider payment ID"))}/refunds`,
        {
          method: "POST",
          headers: context?.idempotencyKey
            ? { "Idempotency-Key": context.idempotencyKey }
            : undefined,
          body: JSON.stringify({
            merchantAccount: options.merchantAccount,
            reference: refund.id,
            amount: { currency: refund.amount.currency, value: refund.amount.amount },
          }),
        },
      );
      return {
        ...refund,
        providerRefundId: asString(result.pspReference),
        status: "pending",
        updatedAt: now(),
      };
    },
    createCheckoutSession: async (input: CreateCheckoutSessionRequest, context) => {
      const result = await request(
        "/sessions",
        {
          method: "POST",
          headers: context?.idempotencyKey
            ? { "Idempotency-Key": context.idempotencyKey }
            : undefined,
          body: JSON.stringify({
            merchantAccount: options.merchantAccount,
            reference: input.orderId,
            amount: { currency: input.amount.currency, value: input.amount.amount },
            returnUrl: input.returnUrl,
            mode: "embedded",
          }),
        },
      );
      return {
        id: requireString(result.id, "checkout session ID"),
        provider,
        paymentId: input.paymentId,
        clientSecret: asString(result.sessionData),
      };
    },
    getSupportedPaymentMethods: async () => [
      { id: "scheme", type: "card", label: "Card", provider },
      { id: "paypal", type: "wallet", label: "PayPal", provider },
    ],
    verifyWebhook: async (payload, _signature, secret) => {
      const item = notificationItem(
        JSON.parse(typeof payload === "string" ? payload : new TextDecoder().decode(payload)),
      );
      const additionalData = item?.additionalData as Record<string, unknown> | undefined;
      const signature = asString(additionalData?.hmacSignature);
      if (!item || !signature || !secret) return false;
      const amount = item.amount as Record<string, unknown> | undefined;
      const canonical = [
        item.pspReference,
        item.originalReference,
        item.merchantAccountCode,
        amount?.value,
        amount?.currency,
        item.eventCode,
        item.success,
      ].map((value) => String(value ?? "")).join(":");
      return verifyHmacSha256({
        payload: canonical,
        signature,
        secret,
        encoding: "base64",
      });
    },
    parseWebhook: (payload): ProviderWebhookEvent => {
      const item = notificationItem(payload);
      if (!item) {
        throw new Error("Adyen webhook did not contain a notification item.");
      }
      const id = [
        requireString(item.pspReference, "webhook PSP reference"),
        requireString(item.eventCode, "webhook event code"),
        String(item.eventDate ?? ""),
      ].join(":");
      return {
        id,
        type: `payment.${String(item.eventCode).toLowerCase()}`,
        paymentId: asString(item.pspReference),
        data: item,
        occurredAt: item.eventDate ? new Date(String(item.eventDate)) : now(),
      };
    },
  };
};
