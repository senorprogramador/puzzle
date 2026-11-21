# @puzzle-ui/commerce

Use Commerce for provider-neutral money, order, payment, refund, provider
adapter, idempotency, and webhook contracts. It is dependency-free and does
not include React, routing, persistence, HTTP handling, or payment-provider
SDKs.

Money is represented by safe integer minor units. Validate currencies at the
boundary and reject cross-currency arithmetic. Provider adapters should live
in separate server-side packages and declare unsupported operations as absent
or disabled capabilities. Keep provider registries application-scoped; do not
introduce mutable module-level defaults.
