# @puzzle-ui/seo – AI development instructions

## 1. Responsibility

Provides typed metadata, canonical URL, Schema.org graph/JSON-LD, validation, sitemap, robots, and framework adapter utilities. Keep SEO data generation deterministic and independent of a particular app's page content.

## 2. Public API

The root exports the common graph, metadata, React, validation, URL, sitemap, robots, and testing APIs. Focused manifest subpaths include `/core`, `/context`, `/schema`, `/metadata`, `/react`, `/server`, `/sitemap`, `/robots`, `/testing`, `/validation`, `/urls`, `/next`, `/tanstack`, and `/react-router`. React is an optional peer; select an entry point matching the runtime.

## 3. Architecture

Schema types and the registry live under `src/schema/`; generated Schema.org definitions are consumed through the generated registry. React JSON-LD/metadata components, server handlers, URL/metadata helpers, and framework adapters have separate entry points. Do not conflate metadata resolution, graph construction, and framework rendering.

## 4. Dependencies

There are no runtime workspace dependencies. React is optional. Do not add framework dependencies or claim that Next/TanStack/React Router peers are declared when they are not; inspect each integration before changing its supported behavior.

## 5. Implementation conventions

Keep graph generation deterministic, validate schema and metadata input, serialize JSON-LD safely, and preserve canonical URL normalization. `src/schema/generated/` is generated: update the pinned source/generator and run `schema:generate` rather than editing generated registry output by hand.

## 6. Testing

Tests live under `src/tests/`. Vitest unit tests run in Node; browser tests use Chromium for React head hoisting, hydration, and scripts. Node integration/package/boundary tests and type-only schema checks have separate scripts.

## 7. Validation

Verified package scripts:

- `bun run schema:check`
- `bun run schema:generate`
- `bun run typecheck`
- `bun run typecheck:test`
- `bun run test:unit`
- `bun run test:browser`
- `bun run test:integration`
- `bun run test:boundaries`
- `bun run test:package`
- `bun run test:schema`
- `bun run vitest`
- `bun run build`

The build checks generated schema output before bundling. `vitest` combines integration, unit, browser, and schema checks.

## 8. Documentation

See [`README.md`](./README.md), the [SEO documentation](../../apps/site/content/docs/seo/index.mdx), and the API-specific subpath docs. Update supported schema, metadata, validation, or framework integration guidance with public behavior changes.

## 9. Common mistakes

- Do not hand-edit generated Schema.org files or skip `schema:check`.
- Do not assume a framework adapter is part of the root API.
- Do not add a schema type or property without checking the generated registry and validation behavior.
- Do not emit metadata or JSON-LD that conflicts with the configured canonical URL.

## 10. Context-efficient workflow

Start with the relevant export in [`src/index.ts`](./src/index.ts) or its subpath index, then inspect the corresponding tests. For schema changes, read the generator and schema registry tests; avoid scanning generated chunks.
