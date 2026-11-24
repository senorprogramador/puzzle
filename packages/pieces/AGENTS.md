# @puzzle-ui/pieces – AI development instructions

## 1. Responsibility

Provides composable, accessible React page sections for marketing, product, commerce, content, business, dashboards, and interactive application flows. Pieces are presentation components; applications own routing, data, validation, persistence, authentication, payments, availability, and backend behavior.

## 2. Public API

Family indexes are re-exported from [`src/index.ts`](./src/index.ts) and imported by named exports from `@puzzle-ui/pieces`. The package exposes only its root; do not rely on family subpath imports. Check the live family index and docs before assuming an export or variant exists.

## 3. Architecture

Families live under `src/components/`, with family-specific indexes, types, implementations, and CSS. Discover components through the [Pieces docs catalog](../../apps/site/content/docs/pieces/index.mdx), category pages, then the family index and `*.types.ts`. Search family types for supported layouts, content contracts, and variants; there is no universal variant or item type.

Compose several families where the page needs them, with visual and layout variety. Reuse UI primitives and section layouts; avoid repeating the same section pattern. Keep copy/media ownership with the consumer and accept consumer-provided React actions and links rather than assuming app routes.

## 4. Dependencies

Runtime Puzzle dependencies are Core, Hooks, Icons, Theme, and UI; React and React DOM 19 are peers. Pieces must remain router- and backend-independent. Do not add database, authentication, payment, booking, or third-party map-service dependencies. The optional CMS authoring family uses framework-neutral `@puzzle-ui/cms` types only; data access, authorization, and persistence remain caller-owned. Consume only the public `CmsCollectionPresentation` safe projection in browser Pieces—never pass raw collection access policies, lifecycle hooks, field callbacks, or secrets to client components.

## 5. Implementation conventions

Use mobile-first, fluid layouts; allow content to wrap; handle image sizing/cropping and meaningful caller-supplied `alt`; use consistent tokenized spacing and semantic Theme tokens. Use UI responsive primitives where they fit. Preserve semantic headings, native controls, keyboard/focus access, reduced motion, and client boundaries for interactive forms, filters, selectors, and dialogs.

Keep all data and actions presentation-only. Do not add persistence, business rules, fetches, navigation, or service calls to a Piece.

Media workflows use the Pieces-owned `MediaLibraryAsset` browser projection,
not media-domain records. Keep storage object keys, tenant/audit internals, and
processing errors out of the projection; preview URLs are temporary and
caller-authorized. Reuse public UI media, navigation, table, and overlay
components rather than implementing duplicates.
Webhook management receives sanitized caller-owned projections and callbacks;
secret values and references must remain server-side.

## 6. Testing

Unit tests cover pure helpers; component tests use jsdom; browser tests use the package's Chromium/Playwright setup for responsive layout, focus, keyboard, media, and overflow. Keep tests alongside the family implementation and extend the appropriate existing layer.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run vitest`
- `bun run test:unit`
- `bun run test:component`
- `bun run test:browser`
- `bun run test:all`
- `bun run build`

## 8. Documentation

See [`README.md`](./README.md), [`ARCHITECTURE.md`](./ARCHITECTURE.md), and the [Pieces documentation](../../apps/site/content/docs/pieces/index.mdx). Follow the [mandatory component workflow](../../docs/ai/workflows/component-development.md) for new or significantly changed components; update the family docs, sidebar, preview, registry, tests, and AI guidance as applicable.

## 9. Common mistakes

- The README's headline family count is not authoritative; its inventory disagrees with current family lists. Verify live indexes and docs rather than deleting or inventing families from a count.
- Do not add a global variant/type abstraction; contracts are intentionally family-specific.
- Do not treat a booking, commerce, or interactive section as owning its underlying workflow.
- Do not import a family through an undocumented package subpath.

## 10. Context-efficient workflow

Search the docs catalog by purpose/category, inspect the matching family page, then read only that family's index, types, implementation, CSS, and tests. Check a closest sibling only when a pattern is unclear; use `ARCHITECTURE.md` for composition and browser-test conventions.
