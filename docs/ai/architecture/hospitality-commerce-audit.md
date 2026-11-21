# Hospitality and commerce capability audit

This audit records the existing Puzzle capabilities relevant to the
hospitality, commerce, checkout, booking, and payment proposal. It is a
Phase 0 deliverable: it identifies reusable implementation and the smallest
missing boundaries before any new public contracts are introduced.

## Current architecture

Puzzle currently separates the relevant responsibilities as follows:

- `@puzzle-ui/ui` provides router-independent React primitives and form
  controls.
- `@puzzle-ui/pieces` provides caller-data-driven presentation sections. Its
  package instructions explicitly keep persistence, validation, payments,
  availability, and backend behavior in the application.
- `@puzzle-ui/core` provides framework-neutral helpers, including locale-aware
  currency and date formatting.
- `@puzzle-ui/fullstack` provides framework-aware Auth, CMS, and Media
  integrations through explicit client, server, Next.js, and TanStack Start
  exports.
- `@puzzle-ui/storage` provides vendor-neutral persistence contracts.
- `@puzzle-ui/cms`, `@puzzle-ui/media`, `@puzzle-ui/seo`, and
  `@puzzle-ui/i18n` already own the corresponding cross-cutting concerns.

The current dependency graph does not contain a commerce or payment domain
package, and no provider SDK or provider adapter is present. Adding payment
contracts to `@puzzle-ui/pieces`, `@puzzle-ui/ui`, or `@puzzle-ui/fullstack`
would blur their current boundaries.

## Capability matrix

| Capability | Existing implementation | Missing functionality | Recommended ownership |
| --- | --- | --- | --- |
| Hospitality UI | `@puzzle-ui/pieces` already exports accommodation, hero, business, gallery, review, host, house-rules, location, service, restaurant, FAQ, footer, and CTA-oriented families. | Additional sections should be identified from concrete use cases rather than duplicated from existing families. | Reuse `@puzzle-ui/pieces`; add only focused families there. |
| Booking domain | Booking presentation exists through `BookingSection`, `AvailabilitySearchSection`, `RatePlansSection`, and `StaySummarySection`. | Booking entities, availability authority, pricing, persistence, lifecycle transitions, cancellation policies, and payment policy are absent. | A framework-neutral commerce/booking domain package, with application-owned orchestration and persistence. |
| Availability | UI slots and caller-provided availability data exist in booking Pieces. | Server-side availability contracts, constraints, expiry, and conflict handling are absent. | Booking domain contracts; the application or external booking service remains the authority. |
| Checkout | `CartSummary`, product, gift-voucher, and commerce sections provide presentation building blocks. | A generic checkout state machine, order validation, customer/address flow, payment confirmation, and fulfillment coordination are absent. | Checkout contracts/services in the domain layer; composed UI in `@puzzle-ui/pieces`. |
| Payments | Core has locale-aware `formatCurrency`; no payment lifecycle or payment persistence model exists. | Money arithmetic, orders, payment attempts, captures, refunds, normalized errors, idempotency, and webhook processing are absent. | New framework-neutral `@puzzle-ui/commerce` (or equivalent) contract package. |
| Stripe | No Stripe SDK, exports, or adapter found. | Hosted Checkout, Payment Element, Payment Intents, lifecycle mapping, refunds, and webhook verification. | Separate optional server adapter package, depending on the shared commerce contracts. |
| Mollie | No Mollie SDK, exports, or adapter found. | Hosted payments, authoritative webhook retrieval, refunds, recurring support, and status mapping. | Separate optional server adapter package, depending on the shared commerce contracts. |
| PayPal | No PayPal SDK, exports, or adapter found. | Orders, approval/capture distinction, authorization, voids, refunds, and webhook verification. | Separate optional server adapter package, depending on the shared commerce contracts. |
| Adyen | No Adyen SDK, exports, or adapter found. | Sessions, additional actions, Web Components integration, capture/cancel, refunds, and webhook handling. | Separate optional server adapter package, depending on the shared commerce contracts. |
| CMS integration | `@puzzle-ui/cms` owns CMS contracts and services; `@puzzle-ui/fullstack` exposes CMS client/server/framework adapters; Pieces accept caller-owned data. | Commerce/booking schemas and mappings are not defined. | Keep CMS optional; add examples or mapping contracts without making domain packages CMS-specific. |
| Media management | `@puzzle-ui/media` owns provider-neutral media and object-storage contracts; UI and Pieces use browser-safe projections and existing media components. | Payment/booking-specific media use cases are not needed in the foundation. | Reuse `@puzzle-ui/media`; do not add commerce dependencies. |
| SEO | `@puzzle-ui/seo` provides metadata, canonical URLs, sitemap, robots, Schema.org, JSON-LD, and framework integrations. | Hospitality, Product, Offer, and booking-specific examples/schema helpers may be useful later. | Extend `@puzzle-ui/seo` only for generic schema contracts; keep factual data caller-owned. |
| Internationalization | `@puzzle-ui/i18n` provides type-safe, SSR-safe React i18n, routing, compiler, sources, and SEO integrations. Core provides locale-aware number/date formatting. | Checkout/booking message catalogs and market-specific provider availability are not defined. | Reuse `@puzzle-ui/i18n`; keep provider and currency availability server-validated. |
| Storage | `@puzzle-ui/storage` defines vendor-neutral collections, queries, capabilities, migrations, and errors; adapters include MongoDB and D1. | Commerce/order/payment/booking schemas, transactions, and idempotency records are absent. | Add domain persistence contracts separately; implement adapters through `@puzzle-ui/storage`. |
| Webhooks | CMS has a reusable, signed, retryable webhook service with a caller-supplied safe transport and persisted delivery attempts. | Payment webhook verification, event normalization, deduplication, out-of-order handling, and provider-specific parsing are absent. | Shared webhook processing contracts in the commerce layer; provider verification in each server adapter. |

## Reuse decisions

The proposal should not create replacements for the following existing
capabilities:

1. Use the existing UI form, date-picker, radio, select, stepper, dialog,
   notification, progress, card, and responsive layout components.
2. Compose checkout and booking presentation from `@puzzle-ui/pieces`; Pieces
   must continue to receive data and callbacks rather than owning pricing,
   availability, persistence, or provider calls.
3. Use Core's formatting utilities for display only. They are not a safe
   substitute for a minor-unit money model or server-side monetary arithmetic.
4. Use Storage for persistence mechanics and adapters, CMS for content
   contracts, Media for asset/object storage, SEO for metadata/schema output,
   and i18n for localized messages and routing.
5. Reuse the CMS webhook service's explicit transport and retry concepts, but
   do not couple payment webhooks to CMS types or transport implementation.

## Recommended package boundaries

### Shared commerce contracts

Introduce one framework-neutral package for the provider-independent
foundation, tentatively `@puzzle-ui/commerce`. It should own:

- safe money and currency types plus arithmetic;
- order, line item, customer, totals, and metadata contracts;
- payment attempts, statuses, state transitions, and refunds;
- provider capabilities and normalized errors;
- adapter interfaces and a non-global provider registry;
- webhook event, deduplication, and idempotency contracts.

This does not belong in Core because Core is a general-purpose utility package,
or in Storage because Storage defines persistence mechanics rather than domain
semantics. It does not belong in Fullstack because the contracts must remain
usable without React, a router, a framework, or a database.

Booking contracts can either be a later subdomain of this package or a
separate package once the first booking use cases establish their shape. The
booking model must not be required by the order or payment model.

### Server infrastructure and provider adapters

Keep orchestration, persistence implementations, authorization, secrets,
webhook HTTP handlers, and framework bindings in server-only packages. Prefer
one optional adapter package per provider so applications do not install
unneeded SDKs and so provider-specific code cannot leak into generic UI.

The provider adapters should depend on the shared commerce contracts, not on
Pieces. They should expose capability declarations and optional operations
instead of forcing unsupported provider behavior into a universal interface.

### Presentation

Add generic checkout and payment-method presentation to `@puzzle-ui/pieces`
only after the domain contracts are stable. Keep these components data-driven,
router-independent, and provider-neutral. Provider-specific client widgets
should be explicit slots or adapter-owned integrations rather than branches
inside generic checkout components.

## Incremental implementation plan

1. **Foundation:** implement and test money, orders, payments, refunds,
   normalized errors, capability declarations, adapter contracts, registry,
   and state transitions in the shared framework-neutral package.
2. **Infrastructure:** add persistence contracts, payment orchestration,
   idempotency, webhook deduplication/retry processing, and consistency rules
   in server-only integrations.
3. **Adapters:** implement Stripe, Mollie, PayPal, and Adyen independently,
   beginning with the provider capabilities needed by the first supported
   checkout flow. Add contract tests and sandbox tests per adapter.
4. **Checkout presentation:** compose customer details, addresses, payment
   method selection, review, summary, success, and failure Pieces without
   introducing provider conditionals.
5. **Booking:** add availability, pricing, rate plans, booking lifecycle,
   payment policies, and persistence independently from checkout, then compose
   the booking flow from the existing checkout and UI primitives.
6. **Hospitality and integrations:** fill only the section gaps identified by
   concrete page compositions, then add CMS/media/SEO/i18n examples and
   documentation.

Each phase should add focused unit, contract, component, browser, or
integration tests appropriate to its boundary. Provider sandbox credentials
must remain outside the repository and must never be used in unit tests.

## Current limitations

This audit does not implement a payment or booking API. The next code change
should be a separately reviewable Phase 1 foundation, after settling the
public package name and whether booking contracts belong in the first
commerce package or a follow-up package.
