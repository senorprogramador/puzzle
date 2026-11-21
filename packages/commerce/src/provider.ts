import type {
  PaymentAttempt,
  NormalizedPaymentError,
  Refund,
} from "./payment";
import type { Money } from "./money";

export interface ProviderCapabilities {
  readonly payments?: boolean;
  readonly refunds?: boolean;
  readonly authorize?: boolean;
  readonly capture?: boolean;
  readonly cancel?: boolean;
  readonly partialCapture?: boolean;
  readonly partialRefund?: boolean;
  readonly recurring?: boolean;
  readonly hostedCheckout?: boolean;
  readonly embeddedCheckout?: boolean;
  readonly wallets?: boolean;
  readonly delayedPaymentMethods?: boolean;
  readonly marketplace?: boolean;
  readonly connectedAccounts?: boolean;
  readonly paymentMethodManagement?: boolean;
  readonly webhooks?: boolean;
  readonly idempotency?: boolean;
}

export type PaymentProviderCapabilities = ProviderCapabilities;

export interface PaymentProviderContext {
  readonly idempotencyKey?: string;
  readonly signal?: AbortSignal;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface CreatePaymentRequest {
  readonly paymentId: string;
  readonly orderId: string;
  readonly amount: Money;
  readonly returnUrl?: string;
  readonly customer?: Readonly<Record<string, string>>;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface AuthorizePaymentRequest {
  readonly payment: PaymentAttempt;
  readonly context?: PaymentProviderContext;
}

export interface CapturePaymentRequest {
  readonly payment: PaymentAttempt;
  readonly amount?: Money;
  readonly context?: PaymentProviderContext;
}

export interface CancelPaymentRequest {
  readonly payment: PaymentAttempt;
  readonly context?: PaymentProviderContext;
}

export interface RefundPaymentRequest {
  readonly payment: PaymentAttempt;
  readonly refund: Refund;
  readonly context?: PaymentProviderContext;
}

export interface RetrieveRefundRequest {
  readonly payment: PaymentAttempt;
  readonly providerRefundId: string;
  readonly context?: PaymentProviderContext;
}

export interface CreateCheckoutSessionRequest extends CreatePaymentRequest {
  readonly cancelUrl?: string;
  readonly mode?: "payment" | "subscription" | "setup";
}

export interface CheckoutSession {
  readonly id: string;
  readonly provider: string;
  readonly paymentId?: string;
  readonly url?: string;
  readonly clientSecret?: string;
  readonly expiresAt?: Date;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface PaymentMethodDescriptor {
  readonly id: string;
  readonly type: string;
  readonly label?: string;
  readonly provider?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface RecurringPaymentRequest {
  readonly payment: PaymentAttempt;
  readonly customerId?: string;
  readonly interval: "day" | "week" | "month" | "year";
  readonly intervalCount?: number;
  readonly context?: PaymentProviderContext;
}

export interface PaymentProviderAdapter {
  readonly id: string;
  readonly name?: string;
  readonly capabilities: ProviderCapabilities;
  readonly createPayment: (request: CreatePaymentRequest, context?: PaymentProviderContext) => Promise<PaymentAttempt>;
  readonly getPayment?: (providerPaymentId: string, context?: PaymentProviderContext) => Promise<PaymentAttempt | undefined>;
  readonly authorize?: (request: AuthorizePaymentRequest) => Promise<PaymentAttempt>;
  readonly capture?: (request: CapturePaymentRequest) => Promise<PaymentAttempt>;
  readonly cancel?: (request: CancelPaymentRequest) => Promise<PaymentAttempt>;
  readonly refund?: (request: RefundPaymentRequest) => Promise<Refund>;
  readonly getRefund?: (request: RetrieveRefundRequest) => Promise<Refund | undefined>;
  readonly createCheckoutSession?: (
    request: CreateCheckoutSessionRequest,
    context?: PaymentProviderContext,
  ) => Promise<CheckoutSession>;
  readonly getSupportedPaymentMethods?: (
    context?: PaymentProviderContext,
  ) => Promise<readonly PaymentMethodDescriptor[]>;
  readonly createRecurringPayment?: (
    request: RecurringPaymentRequest,
  ) => Promise<PaymentAttempt>;
  readonly normalizeError?: (error: unknown) => NormalizedPaymentError;
  readonly verifyWebhook?: (payload: string | Uint8Array, signature: string, secret: string) => Promise<boolean> | boolean;
  readonly parseWebhook?: (payload: unknown) => ProviderWebhookEvent;
}

export type CommerceProviderAdapter = PaymentProviderAdapter;

export interface ProviderWebhookEvent {
  readonly id: string;
  readonly type: string;
  readonly paymentId?: string;
  readonly data: unknown;
  readonly occurredAt: Date;
}

export interface ProviderRegistryOptions {
  readonly providers?: readonly PaymentProviderAdapter[];
  readonly defaultProvider?: string;
}

export class ProviderRegistry {
  readonly #providers: ReadonlyMap<string, PaymentProviderAdapter>;
  readonly #defaultProvider?: string;

  constructor(options: ProviderRegistryOptions = {}) {
    const providers = new Map<string, PaymentProviderAdapter>();
    for (const provider of options.providers ?? []) {
      if (providers.has(provider.id)) throw new Error(`Duplicate payment provider: ${provider.id}`);
      providers.set(provider.id, provider);
    }
    if (options.defaultProvider !== undefined && !providers.has(options.defaultProvider)) {
      throw new Error(`Unknown default payment provider: ${options.defaultProvider}`);
    }
    this.#providers = providers;
    this.#defaultProvider = options.defaultProvider;
  }

  get defaultProvider(): string | undefined {
    return this.#defaultProvider;
  }

  get(id: string): PaymentProviderAdapter | undefined {
    return this.#providers.get(id);
  }

  require(id?: string): PaymentProviderAdapter {
    const providerId = id ?? this.#defaultProvider;
    const provider = providerId ? this.#providers.get(providerId) : undefined;
    if (!provider) throw new Error(providerId ? `Unknown payment provider: ${providerId}` : "No default payment provider configured");
    return provider;
  }

  list(): readonly PaymentProviderAdapter[] {
    return [...this.#providers.values()];
  }

  has(id: string): boolean {
    return this.#providers.has(id);
  }

  register(provider: PaymentProviderAdapter, asDefault = false): ProviderRegistry {
    if (this.#providers.has(provider.id)) throw new Error(`Payment provider already registered: ${provider.id}`);
    return new ProviderRegistry({
      providers: [...this.#providers.values(), provider],
      defaultProvider: asDefault ? provider.id : this.#defaultProvider,
    });
  }

  withDefault(id: string): ProviderRegistry {
    this.require(id);
    return new ProviderRegistry({ providers: this.list(), defaultProvider: id });
  }
}

export const createProviderRegistry = (options?: ProviderRegistryOptions): ProviderRegistry => new ProviderRegistry(options);
