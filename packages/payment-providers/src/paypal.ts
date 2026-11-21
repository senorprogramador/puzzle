import {
  createMoney,
  fromMajorUnits,
  getCurrencyMinorUnit,
  toMajorUnits,
  type PaymentProviderAdapter,
  type PaymentAttempt,
  type ProviderWebhookEvent,
  type RefundPaymentRequest,
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

export type PayPalAdapterOptions = {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly webhookId?: string;
  readonly apiBaseUrl?: string;
  readonly fetcher?: ProviderFetcher;
};

const provider = "paypal";

const providerAmount = (value: ReturnType<typeof createMoney>) =>
  toMajorUnits(value).toFixed(
    getCurrencyMinorUnit(value.currency, { allowUnknownCurrencies: true }),
  );

type PayPalToken = { readonly accessToken: string; readonly expiresAt: number };

const findCaptureId = (order: Record<string, unknown>): string | undefined => {
  const units = Array.isArray(order.purchase_units) ? order.purchase_units : [];
  for (const unit of units) {
    const payments = (unit as Record<string, unknown>).payments as Record<string, unknown> | undefined;
    const captures = Array.isArray(payments?.captures) ? payments.captures : [];
    const capture = captures[0] as Record<string, unknown> | undefined;
    const id = asString(capture?.id);
    if (id) return id;
  }
  return undefined;
};

const amountFromOrder = (
  order: Record<string, unknown>,
  fallback: PaymentAttempt["amount"],
) => {
  const units = Array.isArray(order.purchase_units) ? order.purchase_units : [];
  const amount = (units[0] as Record<string, unknown> | undefined)?.amount as
    | Record<string, unknown>
    | undefined;
  const value = Number(amount?.value);
  return Number.isFinite(value)
    ? fromMajorUnits(value, String(amount?.currency_code ?? fallback.currency))
    : fallback;
};

const paymentFromOrder = (
  order: Record<string, unknown>,
  fallback: Pick<PaymentAttempt, "id" | "orderId" | "amount">,
): PaymentAttempt => {
  const status = String(order.status ?? "CREATED");
  const normalized: PaymentAttempt["status"] =
    status === "COMPLETED"
      ? "succeeded"
      : status === "APPROVED" || status === "PAYER_ACTION_REQUIRED"
        ? "requires_action"
        : status === "VOIDED" || status === "CANCELLED"
          ? "cancelled"
          : "processing";
  const amount = amountFromOrder(order, fallback.amount);
  const captureId = findCaptureId(order);
  return {
    id: fallback.id,
    orderId: fallback.orderId,
    amount,
    status: normalized,
    provider,
    providerPaymentId: requireString(order.id, "order ID"),
    capturedAmount: normalized === "succeeded" ? amount : undefined,
    metadata: captureId ? { capture_id: captureId } : undefined,
    createdAt: now(),
    updatedAt: now(),
  };
};

export const createPayPalAdapter = (
  options: PayPalAdapterOptions,
): PaymentProviderAdapter => {
  if (!options.clientId.trim() || !options.clientSecret.trim()) {
    throw new TypeError("PayPal client credentials are required.");
  }
  const fetcher = options.fetcher ?? fetch;
  const baseUrl = options.apiBaseUrl ?? "https://api-m.paypal.com";
  let token: PayPalToken | undefined;

  const getToken = async () => {
    if (token && token.expiresAt > Date.now() + 30_000) return token.accessToken;
    const response = await fetcher(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: encodeBasicAuth(options.clientId, options.clientSecret),
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: "grant_type=client_credentials",
    });
    const body = await response.json() as Record<string, unknown>;
    if (!response.ok) {
      throw new Error(
        typeof body.error_description === "string"
          ? body.error_description
          : "PayPal authentication failed.",
      );
    }
    const accessToken = requireString(body.access_token, "access token");
    token = {
      accessToken,
      expiresAt: Date.now() + Number(body.expires_in ?? 300) * 1000,
    };
    return accessToken;
  };

  const request = async (path: string, init: RequestInit = {}, requestId?: string) => {
    try {
      const accessToken = await getToken();
      return await requestJson(fetcher, `${baseUrl}${path}`, {
        ...init,
        headers: {
          ...jsonHeaders({
            Authorization: `Bearer ${accessToken}`,
            ...(requestId ? { "PayPal-Request-Id": requestId } : {}),
          }),
          ...init.headers,
        },
      });
    } catch (error) {
      throw createProviderError(error);
    }
  };

  return {
    id: provider,
    name: "PayPal",
    capabilities: {
      payments: true,
      refunds: true,
      authorize: true,
      capture: true,
      partialRefund: true,
      hostedCheckout: true,
      wallets: true,
      webhooks: Boolean(options.webhookId),
      idempotency: true,
    },
    createPayment: async (input, context) => {
      const order = await request(
        "/v2/checkout/orders",
        {
          method: "POST",
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
              reference_id: input.orderId,
              custom_id: input.paymentId,
              amount: {
                currency_code: input.amount.currency,
                value: providerAmount(input.amount),
              },
            }],
            application_context: {
              return_url: input.returnUrl,
              cancel_url: input.returnUrl,
              user_action: "PAY_NOW",
            },
          }),
        },
        context?.idempotencyKey ?? input.paymentId,
      );
      return paymentFromOrder(order, {
        id: input.paymentId,
        orderId: input.orderId,
        amount: input.amount,
      });
    },
    getPayment: async (providerPaymentId) => {
      const order = await request(`/v2/checkout/orders/${encodeURIComponent(providerPaymentId)}`);
      const unit = (Array.isArray(order.purchase_units) ? order.purchase_units[0] : undefined) as
        | Record<string, unknown>
        | undefined;
      return paymentFromOrder(order, {
        id: String(unit?.custom_id ?? providerPaymentId),
        orderId: String(unit?.reference_id ?? ""),
        amount: amountFromOrder(order, createMoney(0, "USD")),
      });
    },
    authorize: async ({ payment, context }) => {
      const order = await request(
        `/v2/checkout/orders/${encodeURIComponent(requireString(payment.providerPaymentId, "provider order ID"))}/authorize`,
        { method: "POST" },
        context?.idempotencyKey,
      );
      return paymentFromOrder(order, payment);
    },
    capture: async ({ payment, context }) => {
      const order = await request(
        `/v2/checkout/orders/${encodeURIComponent(requireString(payment.providerPaymentId, "provider order ID"))}/capture`,
        { method: "POST" },
        context?.idempotencyKey,
      );
      return paymentFromOrder(order, payment);
    },
    refund: async ({ payment, refund, context }: RefundPaymentRequest) => {
      const captureId = payment.metadata?.capture_id;
      if (!captureId) {
        throw createProviderError(
          new Error("PayPal capture ID is required before creating a refund."),
          "validation",
        );
      }
      const result = await request(
        `/v2/payments/captures/${encodeURIComponent(captureId)}/refund`,
        {
          method: "POST",
          body: JSON.stringify({
            amount: {
              currency_code: refund.amount.currency,
              value: providerAmount(refund.amount),
            },
            note_to_payer: refund.reason,
          }),
        },
        context?.idempotencyKey ?? refund.id,
      );
      return {
        ...refund,
        providerRefundId: requireString(result.id, "refund ID"),
        status: result.status === "COMPLETED" ? "succeeded" : "pending",
        updatedAt: now(),
      };
    },
    getSupportedPaymentMethods: async () => [
      { id: "paypal", type: "wallet", label: "PayPal", provider },
    ],
    verifyWebhook: async (payload, signature, secret) => {
      if (!options.webhookId || !secret) return false;
      let headers: Record<string, unknown>;
      try {
        headers = JSON.parse(signature) as Record<string, unknown>;
      } catch {
        return false;
      }
      const accessToken = await getToken();
      const response = await fetcher(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: "POST",
        headers: jsonHeaders({
          Authorization: `Bearer ${accessToken}`,
          "PayPal-Request-Id": crypto.randomUUID(),
        }),
        body: JSON.stringify({
          auth_algo: headers.auth_algo,
          cert_url: headers.cert_url,
          transmission_id: headers.transmission_id,
          transmission_sig: headers.transmission_sig,
          transmission_time: headers.transmission_time,
          webhook_id: options.webhookId,
          webhook_event: JSON.parse(typeof payload === "string" ? payload : new TextDecoder().decode(payload)),
        }),
      });
      if (!response.ok) return false;
      const result = await response.json() as Record<string, unknown>;
      return result.verification_status === "SUCCESS";
    },
    parseWebhook: (payload): ProviderWebhookEvent => {
      const event = payload as Record<string, unknown>;
      const resource = event.resource as Record<string, unknown> | undefined;
      return {
        id: requireString(event.id, "webhook event ID"),
        type: requireString(event.event_type, "webhook event type"),
        paymentId:
          asString(resource?.id) ??
          asString(
            (
              (resource?.supplementary_data as Record<string, unknown> | undefined)
                ?.related_ids as Record<string, unknown> | undefined
            )?.order_id,
          ),
        data: resource ?? event,
        occurredAt: event.create_time ? new Date(String(event.create_time)) : now(),
      };
    },
  };
};
