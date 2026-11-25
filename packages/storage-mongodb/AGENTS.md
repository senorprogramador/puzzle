# @puzzle-ui/storage-mongodb – AI development instructions

## 1. Responsibility

Implements the vendor-neutral Storage contracts using MongoDB, including query execution, conditional writes, pagination, indexes, and versioned migrations. It does not define shared storage semantics or application authorization.

## 2. Public API

The root exports `MongoStorageAdapter`, `MongoStorageMigrationAdapter`, and adapter/migration options from [`src/index.ts`](./src/index.ts). Use adapter methods rather than raw collection names.

## 3. Architecture

The adapter and migration implementation are separate. The default collection prefix is `puzzle_`, configurable with `collectionPrefix`. Transactions and atomic batches are enabled only when `transactionsEnabled` is true and a client is provided.

## 4. Dependencies

Runtime dependencies are `@puzzle-ui/storage` and `mongodb`. Keep MongoDB types and behavior in this adapter; do not add MongoDB to the shared Storage package.

## 5. Implementation conventions

Report only real capabilities. Multi-document transactions require a replica set or sharded deployment and explicit opt-in. MongoDB TTL deletion is asynchronous, so applications must still enforce security-sensitive expiration. Keep migration locks/status in adapter-managed prefixed collections and preserve index behavior.

Match the shared Storage ID semantics: accept an optional insert ID, preserve a
non-empty explicit ID, or use `resolveStorageId` to generate the same Web Crypto
UUID v4 as D1. Preserve existing IDs and `createdAt` on upsert; adapter
metadata controls `updatedAt` and `revision`. A conflicting explicit ID is a
validation error. Query-based upsert is read-then-write; do not imply that the
capability guarantees atomicity.

## 6. Testing

Tests under `tests/` include Storage conformance and adapter-specific regressions. `bun run test` uses `scripts/test-with-mongodb.sh`, which requires Docker and Docker Compose and starts an isolated replica set on a free port; `MONGODB_TEST_PORT` can select a port.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run build`

## 8. Documentation

See [`README.md`](./README.md) and the [Storage adapter documentation](../../apps/site/content/docs/storage/index.mdx). Update transaction, prefix, TTL, and migration guidance whenever capability behavior changes.

## 9. Common mistakes

- Do not assume transactions or atomic batches are enabled by default.
- Do not rely on TTL cleanup for request-time authorization or expiry.
- Do not use raw collection names in application code; use the adapter CRUD methods.
- Do not treat MongoDB behavior as a change to the vendor-neutral contract.
- Do not assume inserts require IDs or that query-based upsert is atomic.

## 10. Context-efficient workflow

Read [`src/index.ts`](./src/index.ts), the target adapter/migration code, and its focused test. Check the shared conformance suite and the package's test script before changing capability claims.
