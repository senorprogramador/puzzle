import { addMoney, compareMoney, createMoney, subtractMoney, type Money } from "./money";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "requires_action"
  | "authorized"
  | "succeeded"
  | "captured"
  | "failed"
  | "cancelled"
  | "partially_refunded"
  | "refunded";

export interface PaymentAttempt {
  readonly id: string;
  readonly orderId: string;
  readonly amount: Money;
  readonly status: PaymentStatus;
  readonly provider: string;
  readonly providerPaymentId?: string;
  readonly capturedAmount?: Money;
  readonly refundedAmount?: Money;
  readonly failure?: NormalizedPaymentError;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export type Payment = PaymentAttempt;

const PAYMENT_TRANSITIONS: Readonly<Record<PaymentStatus, readonly PaymentStatus[]>> = {
  pending: ["processing", "requires_action", "authorized", "succeeded", "captured", "failed", "cancelled"],
  processing: ["requires_action", "authorized", "succeeded", "captured", "failed", "cancelled"],
  requires_action: ["pending", "processing", "authorized", "succeeded", "captured", "failed", "cancelled"],
  authorized: ["captured", "succeeded", "failed", "cancelled"],
  succeeded: ["partially_refunded", "refunded"],
  captured: ["partially_refunded", "refunded"],
  failed: [],
  cancelled: [],
  partially_refunded: ["refunded"],
  refunded: [],
};

export class PaymentTransitionError extends Error {
  readonly code = "INVALID_PAYMENT_TRANSITION";
  readonly from: PaymentStatus;
  readonly to: PaymentStatus;

  constructor(from: PaymentStatus, to: PaymentStatus) {
    super(`Invalid payment transition from ${from} to ${to}`);
    this.name = "PaymentTransitionError";
    this.from = from;
    this.to = to;
  }
}

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  return PAYMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isValidPaymentTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  return canTransitionPayment(from, to);
}

export function validatePaymentTransition(from: PaymentStatus, to: PaymentStatus): void {
  if (!canTransitionPayment(from, to)) throw new PaymentTransitionError(from, to);
}

export function transitionPayment(payment: PaymentAttempt, status: PaymentStatus): PaymentAttempt {
  validatePaymentTransition(payment.status, status);
  return Object.freeze({ ...payment, status, updatedAt: new Date() });
}

export type RefundStatus = "pending" | "succeeded" | "failed" | "cancelled";

export interface Refund {
  readonly id: string;
  readonly paymentId: string;
  readonly amount: Money;
  readonly status: RefundStatus;
  readonly providerRefundId?: string;
  readonly reason?: string;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export class RefundValidationError extends Error {
  readonly code = "INVALID_REFUND";

  constructor(message: string) {
    super(message);
    this.name = "RefundValidationError";
  }
}

export class RefundTransitionError extends Error {
  readonly code = "INVALID_REFUND_TRANSITION";
  readonly from: RefundStatus;
  readonly to: RefundStatus;

  constructor(from: RefundStatus, to: RefundStatus) {
    super(`Invalid refund transition from ${from} to ${to}`);
    this.name = "RefundTransitionError";
    this.from = from;
    this.to = to;
  }
}

export function getRefundableAmount(payment: PaymentAttempt): Money {
  const captured = payment.capturedAmount ?? (payment.status === "succeeded" || payment.status === "captured" || payment.status === "partially_refunded" || payment.status === "refunded" ? payment.amount : createMoney(0, payment.amount.currency, { allowUnknownCurrencies: true }));
  const refunded = payment.refundedAmount ?? createMoney(0, payment.amount.currency, { allowUnknownCurrencies: true });
  return subtractMoney(captured, refunded);
}

export function validateRefundAmount(payment: PaymentAttempt, amount: Money): void {
  if (compareMoney(amount, createMoney(0, amount.currency, { allowUnknownCurrencies: true })) <= 0) {
    throw new RefundValidationError("Refund amount must be positive");
  }
  if (compareMoney(amount, getRefundableAmount(payment)) > 0) {
    throw new RefundValidationError("Refund amount exceeds the refundable payment balance");
  }
}

export function createRefund(
  payment: PaymentAttempt,
  input: Pick<Refund, "id"> & Partial<Pick<Refund, "status" | "reason" | "providerRefundId" | "metadata">> & { amount: Money },
): Refund {
  validateRefundAmount(payment, input.amount);
  return Object.freeze({ ...input, paymentId: payment.id, status: input.status ?? "pending" });
}

export type RefundTransition = `${RefundStatus}->${RefundStatus}`;

export function canTransitionRefund(from: RefundStatus, to: RefundStatus): boolean {
  return from === to || (from === "pending" && ["succeeded", "failed", "cancelled"].includes(to));
}

export function isValidRefundTransition(from: RefundStatus, to: RefundStatus): boolean {
  return canTransitionRefund(from, to);
}

export function validateRefundTransition(from: RefundStatus, to: RefundStatus): void {
  if (!canTransitionRefund(from, to)) throw new RefundTransitionError(from, to);
}

export function transitionRefund(refund: Refund, status: RefundStatus): Refund {
  validateRefundTransition(refund.status, status);
  return Object.freeze({ ...refund, status, updatedAt: new Date() });
}

export interface NormalizedPaymentError {
  readonly code: PaymentErrorCode;
  readonly message: string;
  readonly providerCode?: string;
  readonly retryable: boolean;
  readonly decline?: boolean;
  readonly details?: Readonly<Record<string, string>>;
}

export type PaymentErrorCode =
  | "authentication"
  | "authorization"
  | "declined"
  | "validation"
  | "network"
  | "timeout"
  | "conflict"
  | "unsupported"
  | "unknown";

export class PaymentError extends Error implements NormalizedPaymentError {
  readonly code: PaymentErrorCode;
  readonly providerCode?: string;
  readonly retryable: boolean;
  readonly decline?: boolean;
  readonly details?: Readonly<Record<string, string>>;

  constructor(error: NormalizedPaymentError) {
    super(error.message);
    this.name = "PaymentError";
    this.code = error.code;
    this.providerCode = error.providerCode;
    this.retryable = error.retryable;
    this.decline = error.decline;
    this.details = error.details;
  }
}

export function normalizePaymentError(error: unknown, fallbackCode: PaymentErrorCode = "unknown"): NormalizedPaymentError {
  if (error instanceof PaymentError) return error;
  if (typeof error === "object" && error !== null) {
    const candidate = error as { message?: unknown; code?: unknown; providerCode?: unknown; retryable?: unknown; decline?: unknown };
    const code = typeof candidate.code === "string" ? normalizePaymentErrorCode(candidate.code, fallbackCode) : fallbackCode;
    return {
      code,
      message: typeof candidate.message === "string" ? candidate.message : "Payment provider error",
      providerCode: typeof candidate.providerCode === "string" ? candidate.providerCode : undefined,
      retryable: typeof candidate.retryable === "boolean" ? candidate.retryable : code === "network" || code === "timeout",
      decline: typeof candidate.decline === "boolean" ? candidate.decline : code === "declined",
    };
  }
  return { code: fallbackCode, message: error instanceof Error ? error.message : "Payment provider error", retryable: fallbackCode === "network" || fallbackCode === "timeout", decline: fallbackCode === "declined" };
}

function isPaymentErrorCode(value: string): value is PaymentErrorCode {
  return ["authentication", "authorization", "declined", "validation", "network", "timeout", "conflict", "unsupported", "unknown"].includes(value);
}

function normalizePaymentErrorCode(value: string, fallback: PaymentErrorCode): PaymentErrorCode {
  if (isPaymentErrorCode(value)) return value;
  if (value.includes("declin") || value === "card_error") return "declined";
  if (value.includes("auth")) return "authentication";
  if (value.includes("timeout")) return "timeout";
  if (value.includes("network") || value.includes("connection")) return "network";
  if (value.includes("valid")) return "validation";
  return fallback;
}
