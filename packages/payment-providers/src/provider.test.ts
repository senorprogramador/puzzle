import { describe, expect, it } from "vitest";
import {
  createMoney,
  type CreatePaymentRequest,
} from "@puzzle-ui/commerce";
import { createAdyenAdapter } from "./adyen";
import { createMollieAdapter } from "./mollie";
import { createPayPalAdapter } from "./paypal";
import { createStripeAdapter } from "./stripe";

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const paymentRequest: CreatePaymentRequest = {
  paymentId: "pay_internal",
  orderId: "order_1",
  amount: createMoney(1250, "USD"),
  returnUrl: "https://shop.example/return",
};

describe("Stripe adapter", () => {
  it("creates a PaymentIntent with minor units and preserves provider references", async () => {
    let request: RequestInit | undefined;
    const adapter = createStripeAdapter({
      secretKey: "sk_test_example",
      fetcher: async (_url, init) => {
        request = init;
        return response({
          id: "pi_123",
          amount: 1250,
          amount_received: 0,
          currency: "usd",
          status: "requires_action",
        });
      },
    });

    const payment = await adapter.createPayment(paymentRequest, {
      idempotencyKey: "create_1",
    });
    expect(payment.providerPaymentId).toBe("pi_123");
    expect(payment.status).toBe("requires_action");
    expect(request?.headers).toMatchObject({ "Idempotency-Key": "create_1" });
    expect(String(request?.body)).toContain("amount=1250");
  });
});

describe("Mollie adapter", () => {
  it("uses the authoritative payment lookup for classic webhooks", async () => {
    const calls: string[] = [];
    const adapter = createMollieAdapter({
      apiKey: "test_x",
      fetcher: async (url) => {
        calls.push(String(url));
        return response({
          id: "tr_123",
          status: "paid",
          amount: { currency: "EUR", value: "12.50" },
          metadata: { order_id: "order_1" },
        });
      },
    });

    const valid = await adapter.verifyWebhook!(
      JSON.stringify({ id: "tr_123" }),
      "",
      "",
    );
    expect(valid).toBe(true);
    expect(calls[0]).toContain("/v2/payments/tr_123");
  });
});

describe("PayPal adapter", () => {
  it("uses request IDs for order creation and maps buyer approval", async () => {
    const requests: RequestInit[] = [];
    const adapter = createPayPalAdapter({
      clientId: "client",
      clientSecret: "secret",
      fetcher: async (url, init) => {
        requests.push(init ?? {});
        if (String(url).endsWith("/oauth2/token")) {
          return response({ access_token: "token", expires_in: 300 });
        }
        return response({
          id: "paypal_order_1",
          status: "CREATED",
          purchase_units: [
            {
              reference_id: "order_1",
              custom_id: "pay_internal",
              amount: { currency_code: "USD", value: "12.50" },
            },
          ],
        });
      },
    });

    const payment = await adapter.createPayment(paymentRequest, {
      idempotencyKey: "paypal_create_1",
    });
    expect(payment.status).toBe("processing");
    expect(requests[1]?.headers).toMatchObject({
      "PayPal-Request-Id": "paypal_create_1",
    });
  });
});

describe("Adyen adapter", () => {
  it("parses notification items into provider-neutral webhook events", () => {
    const adapter = createAdyenAdapter({
      apiKey: "api_key",
      merchantAccount: "merchant",
    });
    const event = adapter.parseWebhook!({
      notificationItems: [
        {
          NotificationRequestItem: {
            pspReference: "psp_1",
            eventCode: "AUTHORISATION",
            eventDate: "2026-01-01T00:00:00Z",
            success: "true",
          },
        },
      ],
    });
    expect(event.id).toBe("psp_1:AUTHORISATION:2026-01-01T00:00:00Z");
    expect(event.paymentId).toBe("psp_1");
  });
});
