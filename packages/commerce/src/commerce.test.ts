import { describe, expect, it } from "vitest";
import {
  PaymentTransitionError,
  ProviderRegistry,
  RefundTransitionError,
  RefundValidationError,
  addMoney,
  calculateBookingTotals,
  calculateOrderTotals,
  canTransitionPayment,
  createIdempotencyKey,
  createMoney,
  createRefund,
  createBooking,
  executeIdempotently,
  formatMoney,
  getRefundableAmount,
  multiplyMoney,
  normalizePaymentError,
  processWebhook,
  transitionPayment,
  transitionRefund,
  transitionBooking,
  validateAvailabilityConstraints,
  type IdempotencyRecord,
  type PaymentAttempt,
  type PaymentProviderAdapter,
  type WebhookEvent,
} from "./index";

describe("money", () => {
  it("uses integer minor units for safe arithmetic", () => {
    const price = createMoney(1250, "USD");
    expect(addMoney(price, createMoney(250, "USD"))).toEqual({ amount: 1500, currency: "USD" });
    expect(multiplyMoney(price, 1.5)).toEqual({ amount: 1875, currency: "USD" });
    expect(formatMoney(price, "en-US")).toContain("$12.50");
  });

  it("rejects invalid and cross-currency operations", () => {
    expect(() => createMoney(10.5, "USD")).toThrow();
    expect(() => createMoney(10, "ZZZ")).toThrow();
    expect(() => addMoney(createMoney(1, "USD"), createMoney(1, "EUR"))).toThrow();
    expect(createMoney(1, "LOY", { currencyMinorUnits: { LOY: 0 } })).toEqual({
      amount: 1,
      currency: "LOY",
    });
  });
});

describe("orders and payments", () => {
  const payment: PaymentAttempt = {
    id: "pay_1",
    orderId: "order_1",
    amount: createMoney(1_000, "USD"),
    status: "pending",
    provider: "test",
    capturedAmount: createMoney(1_000, "USD"),
  };

  it("calculates order totals from line items", () => {
    const totals = calculateOrderTotals({
      lineItems: [
        { id: "line_1", name: "Book", quantity: 2, unitPrice: createMoney(1_000, "USD"), tax: createMoney(200, "USD") },
      ],
      shipping: createMoney(100, "USD"),
    });
    expect(totals.subtotal.amount).toBe(2_000);
    expect(totals.total.amount).toBe(2_300);
  });

  it("validates payment transitions and refunds", () => {
    expect(canTransitionPayment("pending", "captured")).toBe(true);
    expect(canTransitionPayment("processing", "succeeded")).toBe(true);
    expect(() => transitionPayment(payment, "refunded")).toThrow(PaymentTransitionError);
    const refund = createRefund({ ...payment, status: "captured" }, { id: "refund_1", amount: createMoney(400, "USD") });
    expect(getRefundableAmount({ ...payment, status: "captured" }).amount).toBe(1_000);
    expect(refund.amount.amount).toBe(400);
    expect(() => createRefund({ ...payment, status: "captured" }, { id: "refund_2", amount: createMoney(1_001, "USD") })).toThrow(RefundValidationError);
    expect(transitionRefund(refund, "succeeded").status).toBe("succeeded");
    expect(() => transitionRefund(refund, "cancelled")).not.toThrow();
    expect(() => transitionRefund({ ...refund, status: "succeeded" }, "failed")).toThrow(RefundTransitionError);
  });
});

describe("provider registry", () => {
  const adapter = (id: string): PaymentProviderAdapter => ({
    id,
    capabilities: { payments: true },
    createPayment: async (request) => ({ ...paymentFor(request.paymentId, request.orderId, request.amount), provider: id }),
  });

  describe("booking", () => {
    const dates = {
      checkIn: new Date("2026-07-10T00:00:00Z"),
      checkOut: new Date("2026-07-14T00:00:00Z"),
    };
    const totals = calculateBookingTotals({
      base: createMoney(800, "EUR"),
      lines: [
        { id: "tax", label: "Tax", amount: createMoney(80, "EUR"), kind: "tax" },
        { id: "discount", label: "Discount", amount: createMoney(50, "EUR"), kind: "discount" },
      ],
    });

    it("calculates price lines and validates availability constraints", () => {
      expect(totals.total.amount).toBe(830);
      expect(() =>
        validateAvailabilityConstraints(dates, { minimumStayNights: 5 }),
      ).toThrow();
      expect(() =>
        validateAvailabilityConstraints(dates, { minimumStayNights: 3 }),
      ).not.toThrow();
    });

    it("keeps booking lifecycle transitions explicit", () => {
      const booking = createBooking({
        id: "booking_1",
        resourceId: "room_1",
        dates,
        guests: { adults: 2 },
        paymentPolicy: { type: "deposit", amount: createMoney(200, "EUR") },
        totals,
      });
      expect(transitionBooking(booking, "pending").status).toBe("pending");
      expect(transitionBooking({ ...booking, status: "pending" }, "confirmed").status).toBe("confirmed");
    });
  });

  it("keeps provider selection scoped to a registry", () => {
    const registry = new ProviderRegistry({ providers: [adapter("one"), adapter("two")], defaultProvider: "two" });
    expect(registry.require().id).toBe("two");
    expect(registry.list()).toHaveLength(2);
    expect(registry.withDefault("one").require().id).toBe("one");
  });
});

describe("idempotency and webhooks", () => {
  it("replays completed idempotent operations and deduplicates webhooks", async () => {
    const records = new Map<string, IdempotencyRecord<number>>();
    const store = {
      get: async (key: string) => records.get(key),
      set: async (record: IdempotencyRecord<number>) => void records.set(record.key, record),
    };
    let runs = 0;
    const key = createIdempotencyKey("test");
    expect(await executeIdempotently(store, key, async () => ++runs)).toBe(1);
    expect(await executeIdempotently(store, key, async () => ++runs)).toBe(1);
    expect(runs).toBe(1);

    const seen = new Set<string>();
    let handled = 0;
    const webhookStore = {
      isProcessed: async (_provider: string, id: string) => seen.has(id),
      markProcessed: async (_provider: string, id: string) => void seen.add(id),
    };
    const event: WebhookEvent = { id: "evt_1", provider: "test", type: "payment.captured", payload: {}, occurredAt: new Date() };
    expect(await processWebhook(event, webhookStore, async () => void ++handled)).toEqual({ duplicate: false, eventId: "evt_1" });
    expect(await processWebhook(event, webhookStore, async () => void ++handled)).toEqual({ duplicate: true, eventId: "evt_1" });
    expect(handled).toBe(1);
    expect(normalizePaymentError({ code: "declined", message: "No funds" }).decline).toBe(true);
  });
});

function paymentFor(id: string, orderId: string, amount: PaymentAttempt["amount"]): PaymentAttempt {
  return { id, orderId, amount, status: "pending", provider: "test" };
}
