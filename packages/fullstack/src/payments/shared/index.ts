import type {
  PaymentAttempt,
  PaymentMethodDescriptor,
  ProviderWebhookEvent,
  Refund,
} from "@puzzle-ui/commerce";

export type PaymentApiCreateInput = {
  readonly orderId: string;
  readonly providerId?: string;
  readonly returnUrl?: string;
  readonly idempotencyKey: string;
};

export type PaymentApiActionInput = {
  readonly paymentId: string;
  readonly idempotencyKey: string;
};

export type PaymentApiRefundInput = PaymentApiActionInput & {
  readonly amount: number;
  readonly currency: string;
  readonly reason?: string;
};

export type PaymentApiCreateResponse = {
  readonly payment: PaymentAttempt;
  readonly checkoutSessionId?: string;
  readonly checkoutUrl?: string;
  readonly clientSecret?: string;
};

export type PaymentApiRefundResponse = {
  readonly refund: Refund;
};

export type PaymentApiMethodsResponse = {
  readonly provider: string;
  readonly methods: readonly PaymentMethodDescriptor[];
};

export type PaymentApiWebhookResponse = {
  readonly accepted: boolean;
  readonly duplicate: boolean;
  readonly eventId?: string;
};

export type PaymentApiWebhookEvent = ProviderWebhookEvent;
