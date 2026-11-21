# @puzzle-ui/payment-providers

Server-only, fetch-based adapters for the provider-independent contracts in
`@puzzle-ui/commerce`.

```ts
import { createStripeAdapter } from "@puzzle-ui/payment-providers/stripe";

const stripe = createStripeAdapter({
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
});
```

Available adapters:

- `@puzzle-ui/payment-providers/stripe`
- `@puzzle-ui/payment-providers/mollie`
- `@puzzle-ui/payment-providers/paypal`
- `@puzzle-ui/payment-providers/adyen`

The package never exposes credentials through client-safe exports. Applications
must calculate totals from trusted server-side order data, use idempotency keys
for mutations, verify webhooks before processing them, and persist provider
references separately from internal payment IDs.

The adapters use the platform `fetch` API rather than bundling provider SDKs.
Provider sandbox and production credentials remain the responsibility of the
host application.
