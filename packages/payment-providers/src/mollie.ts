import {
  createMoney,
  getCurrencyMinorUnit,
  fromMajorUnits,
  toMajorUnits,
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

export type MollieAdapterOptions = {
  readonly apiKey: string;
  readonly apiBaseUrl?: string;
  readonly fetcher?: ProviderFetcher;
  readonly webhookSignatureEncoding?: "hex" | "base64";
};

const provider = "mollie";

const providerAmount = (value: ReturnType<typeof createMoney>) =>
  toMajorUnits(value).toFixed(
    getCurrencyMinorUnit(value.currency, { allowUnknownCurrencies: true }),
  );

const moneyFromMollie = (value: unknown, fallbackCurrency: string) => {
  const amount = value as Record<string, unknown> | undefined;
  const currency = String(amount?.currency ?? fallbackCurrency).toUpperCase();
  const major = Number(amount?.value);
  if (!Number.isFinite(major)) {
    throw new Error("Mollie response omitted a valid amount.");
  }
  return fromMajorUnits(major, currency);
};

const paymentFromMollie = (
  value: Record<string, unknown>,
  fallback: Pick<PaymentAttempt, "id" | "orderId" | "amount">,
): PaymentAttempt => {
  const status = String(value.status ?? "open");
  const normalized: PaymentAttempt["status"] =
    status === "paid" || status === "paid_out"
      ? "succeeded"
      : status === "authorized"
        ? "authorized"
        : status === "pending" || status === "open"
          ? "processing"
          : status === "canceled" || status === "expired"
            ? "cancelled"
            : status === "failed"
              ? "failed"
              : "pending";
  const amount = moneyFromMollie(value.amount, fallback.amount.currency);
  return {
    id: fallback.id,
    orderId: fallback.orderId,
    amount,
    status: normalized,
    provider,
    providerPaymentId: requireString(value.id, "payment ID"),
    capturedAmount: normalized === "succeeded" ? amount : undefined,
    failure:
      normalized === "failed"
        ? {
            code: "declined",
            message: "Mollie payment failed.",
            providerCode: asString(value.failureReason),
            retryable: false,
            decline: true,
          }
        : undefined,
    createdAt: value.createdAt ? new Date(String(value.createdAt)) : now(),
    updatedAt: now(),
  };
};

export const createMollieAdapter = (
  options: MollieAdapterOptions,
): PaymentProviderAdapter => {
  if (!options.apiKey.trim()) throw new TypeError("Mollie API key is required.");
  const fetcher = options.fetcher ?? fetch;
  const baseUrl = options.apiBaseUrl ?? "https://api.mollie.com";
  const request = async (path: string, init: RequestInit = {}) => {
    try {
      return await requestJson(fetcher, `${baseUrl}${path}`, {
        ...init,
        headers: {
          ...jsonHeaders({ Authorization: `Bearer ${options.apiKey}` }),
          ...init.headers,
        },
      });
    } catch (error) {
      throw createProviderError(error);
    }
  };

  return {
    id: provider,
    name: "Mollie",
    capabilities: {
      payments: true,
      refunds: true,
      partialRefund: true,
      recurring: true,
      hostedCheckout: true,
      delayedPaymentMethods: true,
      webhooks: true,
      idempotency: true,
    },
    createPayment: async (input, context) => {
      const payment = await request("/v2/payments", {
        method: "POST",
        headers: {
          "Idempotency-Key": context?.idempotencyKey ?? input.paymentId,
        },
        body: JSON.stringify({
          amount: {
            currency: input.amount.currency,
            value: providerAmount(input.amount),
          },
          description: `Order ${input.orderId}`,
          redirectUrl: input.returnUrl,
          metadata: { order_id: input.orderId, payment_id: input.paymentId },
        }),
      });
      return paymentFromMollie(payment, {
        id: input.paymentId,
        orderId: input.orderId,
        amount: input.amount,
      });
    },
    getPayment: async (providerPaymentId) => {
      const payment = await request(`/v2/payments/${encodeURIComponent(providerPaymentId)}`);
      return paymentFromMollie(payment, {
        id: providerPaymentId,
        orderId: String(
          (payment.metadata as Record<string, unknown> | undefined)?.order_id ?? "",
        ),
        amount: moneyFromMollie(payment.amount, "EUR"),
      });
    },
    refund: async ({ payment, refund, context }: RefundPaymentRequest) => {
      const result = await request(
        `/v2/payments/${encodeURIComponent(requireString(payment.providerPaymentId, "provider payment ID"))}/refunds`,
        {
          method: "POST",
          headers: {
            "Idempotency-Key": context?.idempotencyKey ?? refund.id,
          },
          body: JSON.stringify({
            amount: {
              currency: refund.amount.currency,
              value: providerAmount(refund.amount),
            },
            description: refund.reason,
          }),
        },
      );
      return {
        ...refund,
        providerRefundId: requireString(result.id, "refund ID"),
        status:
          result.status === "refunded"
            ? "succeeded"
            : result.status === "failed"
              ? "failed"
              : "pending",
        updatedAt: now(),
      };
    },
    createCheckoutSession: async (input: CreateCheckoutSessionRequest) => {
      const payment = await request("/v2/payments", {
        method: "POST",
        body: JSON.stringify({
          amount: {
            currency: input.amount.currency,
            value: providerAmount(input.amount),
          },
          description: `Order ${input.orderId}`,
          redirectUrl: input.returnUrl,
          metadata: { order_id: input.orderId, payment_id: input.paymentId },
        }),
      });
      const checkout = (payment._links as Record<string, unknown> | undefined)?.checkout as
        | Record<string, unknown>
        | undefined;
      return {
        id: requireString(payment.id, "payment ID"),
        provider,
        paymentId: input.paymentId,
        url: asString(checkout?.href),
      };
    },
    getSupportedPaymentMethods: async () => [
      { id: "ideal", type: "bank", label: "iDEAL", provider },
      { id: "bancontact", type: "bank", label: "Bancontact", provider },
      { id: "card", type: "card", label: "Card", provider },
    ],
    verifyWebhook: async (payload, signature, secret) => {
      const body = typeof payload === "string" ? payload : new TextDecoder().decode(payload);
      if (secret) {
        return verifyHmacSha256({
          payload: body,
          signature,
          secret,
          encoding: options.webhookSignatureEncoding ?? "base64",
        });
      }
      try {
        const parsed = JSON.parse(body) as Record<string, unknown>;
        const id = asString(parsed.id);
        if (!id) return false;
        await request(`/v2/payments/${encodeURIComponent(id)}`);
        return true;
      } catch {
        return false;
      }
    },
    parseWebhook: (payload): ProviderWebhookEvent => {
      const event = payload as Record<string, unknown>;
      return {
        id: requireString(event.id, "webhook payment ID"),
        type: `payment.${String(event.status ?? "updated")}`,
        paymentId: asString(event.id),
        data: event,
        occurredAt: now(),
      };
    },
  };
};
