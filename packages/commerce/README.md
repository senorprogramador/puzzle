# @puzzle-ui/commerce

Provider-independent commerce contracts for orders, payments, refunds, and
webhooks. The package is framework-neutral and dependency-free: it does not
include a payment SDK, persistence adapter, HTTP handler, or UI integration.

```sh
npm install @puzzle-ui/commerce
```

Money values use safe integer minor units:

```ts
import { addMoney, createMoney, formatMoney } from "@puzzle-ui/commerce";

const total = addMoney(createMoney(1250, "USD"), createMoney(250, "USD"));
formatMoney(total, "en-US"); // "$15.00"
```

Use an application-owned `ProviderRegistry` to select one or more server-side
provider adapters. Provider SDKs and webhook signature verification belong in
separate adapter packages.
