# @puzzle-ui/payment-providers

Use this package only from server code. It provides optional Stripe, Mollie,
PayPal, and Adyen adapters for `@puzzle-ui/commerce`; it must not be imported by
UI, Pieces, browser, or shared client modules.

Every payment mutation requires a caller-owned idempotency key and trusted
server-side amounts. Webhook payloads must be verified before parsing and
processed through the commerce webhook deduplication contract. Provider
credentials and webhook secrets must remain in server-side secret storage.
