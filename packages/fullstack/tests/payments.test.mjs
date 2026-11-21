import test from "node:test";
import assert from "node:assert/strict";

import {
  createMoney,
  createOrder,
  createProviderRegistry,
} from "@puzzle-ui/commerce";
import { PaymentServer } from "../dist/payments/server/index.js";

test("payment server resolves trusted order totals and replays idempotent creates", async () => {
  const order = createOrder({
    id: "order_1",
    customer: { email: "guest@example.test" },
    lineItems: [{
      id: "line_1",
      name: "Stay",
      quantity: 1,
      unitPrice: createMoney(1250, "EUR"),
    }],
  });
  const payments = new Map();
  const refunds = new Map();
  const records = new Map();
  let createCalls = 0;
  let sessionCalls = 0;
  const adapter = {
    id: "test",
    capabilities: {
      payments: true,
      capture: true,
      refunds: true,
      webhooks: true,
      idempotency: true,
    },
    createPayment: async (input) => {
      createCalls += 1;
      return {
        id: input.paymentId,
        orderId: input.orderId,
        amount: input.amount,
        status: "pending",
        provider: "test",
        providerPaymentId: "provider_1",
      };
    },
    capture: async ({ payment }) => ({ ...payment, status: "succeeded", capturedAmount: payment.amount }),
    refund: async ({ refund }) => ({ ...refund, status: "succeeded", providerRefundId: "refund_1" }),
    createCheckoutSession: async (input) => {
      sessionCalls += 1;
      return {
        id: "session_1",
        provider: "test",
        paymentId: input.paymentId,
        url: "https://provider.example/session_1",
      };
    },
    verifyWebhook: async () => true,
    parseWebhook: () => ({
      id: "event_1",
      type: "payment.succeeded",
      paymentId: "provider_1",
      data: {},
      occurredAt: new Date(),
    }),
    getPayment: async () => ({
      id: "payment_internal",
      orderId: "order_1",
      amount: order.totals.total,
      status: "succeeded",
      provider: "test",
      providerPaymentId: "provider_1",
    }),
  };
  const server = new PaymentServer({
    registry: createProviderRegistry({ providers: [adapter], defaultProvider: "test" }),
    store: {
      getOrder: async () => order,
      savePayment: async (payment) => void payments.set(payment.id, payment),
      getPayment: async (id) => payments.get(id),
      saveRefund: async (refund) => void refunds.set(refund.id, refund),
    },
    idempotency: {
      get: async (key, scope) => records.get(`${scope ?? ""}:${key}`),
      set: async (record) => void records.set(`${record.scope ?? ""}:${record.key}`, record),
    },
    webhooks: {
      isProcessed: async (_provider, id) => records.has(`webhook:${id}`),
      markProcessed: async (_provider, id) => void records.set(`webhook:${id}`, true),
    },
    idGenerator: () => "payment_internal",
  });

  const input = {
    orderId: "order_1",
    providerId: "test",
    idempotencyKey: "create_1",
  };
  const first = await server.createPayment(input);
  const second = await server.createPayment(input);
  assert.equal(first.payment.amount.amount, 1250);
  assert.equal(second.payment.id, first.payment.id);
  assert.equal(createCalls, 1);
  const firstSession = await server.createCheckoutSession(input);
  const secondSession = await server.createCheckoutSession(input);
  assert.equal(firstSession.id, "session_1");
  assert.equal(secondSession.id, "session_1");
  assert.equal(sessionCalls, 1);
});

test("payment server deduplicates verified webhooks", async () => {
  const records = new Map();
  let saved = 0;
  const adapter = {
    id: "test",
    capabilities: { webhooks: true },
    createPayment: async () => {
      throw new Error("not used");
    },
    verifyWebhook: async () => true,
    parseWebhook: () => ({
      id: "event_1",
      type: "payment.succeeded",
      paymentId: "provider_1",
      data: {},
      occurredAt: new Date(),
    }),
    getPayment: async () => undefined,
  };
  const server = new PaymentServer({
    registry: createProviderRegistry({ providers: [adapter] }),
    store: {
      getOrder: async () => undefined,
      savePayment: async () => void saved++,
      getPayment: async () => undefined,
      saveRefund: async () => {},
    },
    idempotency: { get: async () => undefined, set: async () => {} },
    webhooks: {
      isProcessed: async (_provider, id) => records.has(id),
      markProcessed: async (_provider, id) => void records.set(id, true),
    },
    resolveWebhookSecret: async () => "test-secret",
  });

  assert.deepEqual(
    await server.handleWebhook("test", JSON.stringify({ event: true }), "signature"),
    { accepted: true, duplicate: false, eventId: "event_1" },
  );
  assert.deepEqual(
    await server.handleWebhook("test", JSON.stringify({ event: true }), "signature"),
    { accepted: true, duplicate: true, eventId: "event_1" },
  );
  assert.equal(saved, 0);
});
