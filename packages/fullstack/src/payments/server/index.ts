import {
  PaymentError,
  createIdempotencyKey,
  createMoney,
  createRefund,
  executeIdempotently,
  getRefundableAmount,
  normalizePaymentError,
  processWebhook,
  type IdempotencyStore,
  type CheckoutSession,
  type Order,
  type PaymentAttempt,
  type PaymentProviderAdapter,
  type ProviderRegistry,
  type ProviderWebhookEvent,
  type Refund,
  type WebhookEvent,
  type WebhookEventStore,
} from "@puzzle-ui/commerce";
import type {
  PaymentApiActionInput,
  PaymentApiCreateInput,
  PaymentApiCreateResponse,
  PaymentApiMethodsResponse,
  PaymentApiRefundInput,
  PaymentApiRefundResponse,
  PaymentApiWebhookResponse,
} from "../shared";

export type PaymentStore = {
  readonly getOrder: (orderId: string) => Promise<Order | undefined>;
  readonly savePayment: (payment: PaymentAttempt) => Promise<void>;
  readonly getPayment: (paymentId: string) => Promise<PaymentAttempt | undefined>;
  readonly saveRefund: (refund: Refund) => Promise<void>;
};

export type PaymentServerOptions = {
  readonly registry: ProviderRegistry;
  readonly store: PaymentStore;
  readonly idempotency: IdempotencyStore<PaymentApiCreateResponse | PaymentAttempt | PaymentApiRefundResponse>;
  readonly webhooks: WebhookEventStore;
  readonly resolveWebhookSecret?: (providerId: string) => Promise<string>;
  readonly authorize?: (input: {
    readonly operation: "create" | "capture" | "cancel" | "refund" | "methods";
    readonly order?: Order;
    readonly payment?: PaymentAttempt;
  }) => Promise<boolean> | boolean;
  readonly idGenerator?: () => string;
};

export class PaymentServerError extends Error {
  readonly code: "not_found" | "unauthorized" | "unsupported";

  constructor(
    code: PaymentServerError["code"],
    message: string,
  ) {
    super(message);
    this.name = "PaymentServerError";
    this.code = code;
  }
}

const assertAuthorized = async (
  options: PaymentServerOptions,
  input: Parameters<NonNullable<PaymentServerOptions["authorize"]>>[0],
) => {
  if (options.authorize && !(await options.authorize(input))) {
    throw new PaymentServerError("unauthorized", "Payment operation is not authorized.");
  }
};

const providerError = (error: unknown): PaymentError =>
  new PaymentError(normalizePaymentError(error));

export class PaymentServer {
  readonly #options: PaymentServerOptions;

  constructor(options: PaymentServerOptions) {
    if (!options?.registry || !options.store || !options.idempotency || !options.webhooks) {
      throw new TypeError("Payment server requires a provider registry, store, idempotency, and webhook stores.");
    }
    this.#options = options;
  }

  async createPayment(input: PaymentApiCreateInput): Promise<PaymentApiCreateResponse> {
    const order = await this.#options.store.getOrder(input.orderId);
    if (!order) throw new PaymentServerError("not_found", "Order was not found.");
    await assertAuthorized(this.#options, { operation: "create", order });

    return executeIdempotently(
      this.#options.idempotency as IdempotencyStore<PaymentApiCreateResponse>,
      input.idempotencyKey,
      async () => {
        const provider = this.#options.registry.require(input.providerId);
        const paymentId = this.#options.idGenerator?.() ?? createIdempotencyKey("payment");
        try {
          const payment = await provider.createPayment({
            paymentId,
            orderId: order.id,
            amount: order.totals.total,
            returnUrl: input.returnUrl,
            customer: {
              email: order.customer.email,
              ...(order.customer.name ? { name: order.customer.name } : {}),
              ...(order.customer.phone ? { phone: order.customer.phone } : {}),
            },
            metadata: order.metadata,
          }, { idempotencyKey: input.idempotencyKey });
          await this.#options.store.savePayment(payment);
          return { payment };
        } catch (error) {
          throw providerError(error);
        }

      },
      { scope: `payment:create:${order.id}` },
    );
  }

  async createCheckoutSession(
    input: PaymentApiCreateInput & { readonly cancelUrl?: string },
  ): Promise<CheckoutSession> {
    const order = await this.#options.store.getOrder(input.orderId);
    if (!order) throw new PaymentServerError("not_found", "Order was not found.");
    await assertAuthorized(this.#options, { operation: "create", order });
    const provider = this.#options.registry.require(input.providerId);
    if (!provider.createCheckoutSession) {
      throw new PaymentServerError("unsupported", "The selected provider does not support hosted checkout.");
    }
    return executeIdempotently(
      this.#options.idempotency as unknown as IdempotencyStore<CheckoutSession>,
      input.idempotencyKey,
      async () => {
        try {
          return await provider.createCheckoutSession!({
            paymentId: this.#options.idGenerator?.() ?? createIdempotencyKey("payment"),
            orderId: order.id,
            amount: order.totals.total,
            returnUrl: input.returnUrl,
            cancelUrl: input.cancelUrl,
          }, { idempotencyKey: input.idempotencyKey });
        } catch (error) {
          throw providerError(error);
        }
      },
      { scope: `checkout-session:create:${order.id}` },
    );
  }

  async capturePayment(input: PaymentApiActionInput): Promise<PaymentAttempt> {
    const payment = await this.requirePayment(input.paymentId);
    const provider = this.#options.registry.require(payment.provider);
    await assertAuthorized(this.#options, { operation: "capture", payment });
    if (!provider.capture) {
      throw new PaymentServerError("unsupported", "The selected provider does not support capture.");
    }
    return this.runPaymentOperation(input.idempotencyKey, `payment:capture:${payment.id}`, async () => {
      try {
        const capture = provider.capture;
        if (!capture) {
          throw new PaymentServerError("unsupported", "The selected provider does not support capture.");
        }
        const captured = await capture({ payment, context: { idempotencyKey: input.idempotencyKey } });
        await this.#options.store.savePayment(captured);
        return captured;
      } catch (error) {
        throw providerError(error);
      }
    });
  }

  async cancelPayment(input: PaymentApiActionInput): Promise<PaymentAttempt> {
    const payment = await this.requirePayment(input.paymentId);
    const provider = this.#options.registry.require(payment.provider);
    await assertAuthorized(this.#options, { operation: "cancel", payment });
    if (!provider.cancel) {
      throw new PaymentServerError("unsupported", "The selected provider does not support cancellation.");
    }
    return this.runPaymentOperation(input.idempotencyKey, `payment:cancel:${payment.id}`, async () => {
      try {
        const cancelled = await provider.cancel!({ payment, context: { idempotencyKey: input.idempotencyKey } });
        await this.#options.store.savePayment(cancelled);
        return cancelled;
      } catch (error) {
        throw providerError(error);
      }
    });
  }

  async refundPayment(input: PaymentApiRefundInput): Promise<PaymentApiRefundResponse> {
    const payment = await this.requirePayment(input.paymentId);
    const provider = this.#options.registry.require(payment.provider);
    await assertAuthorized(this.#options, { operation: "refund", payment });
    if (!provider.refund) {
      throw new PaymentServerError("unsupported", "The selected provider does not support refunds.");
    }
    const amount = createMoney(input.amount, input.currency);
    if (getRefundableAmount(payment).currency !== amount.currency) {
      throw new PaymentError({
        code: "validation",
        message: "Refund currency must match the payment currency.",
        retryable: false,
      });
    }
    const refund = createRefund(payment, {
      id: this.#options.idGenerator?.() ?? createIdempotencyKey("refund"),
      amount,
      reason: input.reason,
    });
    return this.runPaymentOperation(input.idempotencyKey, `payment:refund:${payment.id}`, async () => {
      try {
        const result = await provider.refund!({
          payment,
          refund,
          context: { idempotencyKey: input.idempotencyKey },
        });
        await this.#options.store.saveRefund(result);
        return { refund: result };
      } catch (error) {
        throw providerError(error);
      }
    });
  }

  async listPaymentMethods(providerId?: string): Promise<PaymentApiMethodsResponse> {
    const provider = this.#options.registry.require(providerId);
    await assertAuthorized(this.#options, { operation: "methods" });
    if (!provider.getSupportedPaymentMethods) {
      throw new PaymentServerError("unsupported", "The selected provider does not expose payment methods.");
    }
    return {
      provider: provider.id,
      methods: await provider.getSupportedPaymentMethods(),
    };
  }

  async handleWebhook(
    providerId: string,
    payload: string | Uint8Array,
    signature: string,
  ): Promise<PaymentApiWebhookResponse> {
    const provider = this.#options.registry.require(providerId);
    if (!provider.verifyWebhook || !provider.parseWebhook || !this.#options.resolveWebhookSecret) {
      throw new PaymentServerError("unsupported", "Webhook verification is not configured for this provider.");
    }
    const secret = await this.#options.resolveWebhookSecret(providerId);
    if (!(await provider.verifyWebhook(payload, signature, secret))) {
      throw new PaymentError({
        code: "authorization",
        message: "Payment webhook verification failed.",
        retryable: false,
      });
    }
    const event = provider.parseWebhook(JSON.parse(typeof payload === "string" ? payload : new TextDecoder().decode(payload)));
    const webhookEvent: WebhookEvent<ProviderWebhookEvent> = {
      id: event.id,
      provider: providerId,
      type: event.type,
      payload: event,
      occurredAt: event.occurredAt,
    };
    const result = await processWebhook(webhookEvent, this.#options.webhooks, async (received) => {
      if (!received.payload.paymentId || !provider.getPayment) return;
      const payment = await provider.getPayment(received.payload.paymentId);
      if (payment) await this.#options.store.savePayment(payment);
    });
    return { accepted: true, duplicate: result.duplicate, eventId: result.eventId };
  }

  private async requirePayment(paymentId: string): Promise<PaymentAttempt> {
    const payment = await this.#options.store.getPayment(paymentId);
    if (!payment) throw new PaymentServerError("not_found", "Payment was not found.");
    return payment;
  }

  private async runPaymentOperation<T>(
    key: string,
    scope: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    return executeIdempotently(this.#options.idempotency as unknown as IdempotencyStore<T>, key, operation, { scope });
  }
}
