# @puzzle-ui/storage-d1 – AI development instructions

## 1. Responsibility

Implements the vendor-neutral Storage contracts for Cloudflare D1, including query execution, conditional writes, cursor pagination, collection indexes, and versioned migrations. It is an adapter, not the shared Storage contract or application schema owner.

## 2. Public API

The package root exports `D1StorageAdapter`, `D1StorageMigrationAdapter`, and D1-like binding, statement, result, and options types from [`src/index.ts`](./src/index.ts).

## 3. Architecture

The adapter and migration engine are separate (`d1.adapter.ts`, `d1.migrations.ts`) and consume the minimal D1-like interfaces in `d1.types.ts`. Default table and migration tables use the `puzzle_` prefix; a caller may configure `tablePrefix`.

## 4. Dependencies

`@puzzle-ui/storage` is the only runtime package dependency. The runtime supplies the D1 binding; do not add a Cloudflare framework dependency or duplicate shared query/capability types.

## 5. Implementation conventions

Preserve the shared query AST, serialization, cursor, capability, and migration semantics. D1 has no native TTL indexes; do not claim TTL support or substitute adapter cleanup for application expiry checks. Migrations are explicit adapter-managed versioned migrations, not Wrangler SQL migrations; run them in startup/deployment orchestration, not per request.

Keep dotted JSON paths validated by the shared Storage query validator, generate SQL paths only from validated segments, and bind filter values as parameters. Preserve shared `contains` behavior: case-insensitive substring matching for strings and exact scalar membership for arrays. SQLite's built-in `lower()` is ASCII-only.

## 6. Testing

Tests under `tests/` use Bun and run contract/conformance behavior against the D1 test environment. Keep adapter and migration tests isolated and cover the capabilities D1 actually advertises.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run build`

## 8. Documentation

See [`README.md`](./README.md) and the [Storage adapter documentation](../../apps/site/content/docs/storage/index.mdx). Update D1 capability, prefix, migration, or deployment notes with implementation changes.

## 9. Common mistakes

- Do not create or alter Wrangler SQL migrations for the adapter's own migration protocol.
- Do not run migration setup on every request.
- Do not add unsupported TTL or transaction guarantees.
- Do not bypass the shared `StorageAdapter` contract with D1-only methods in consumers.

## 10. Context-efficient workflow

Read [`src/index.ts`](./src/index.ts), then the relevant adapter or migration file and its conformance test. Consult the shared Storage type only for the contract being implemented.
