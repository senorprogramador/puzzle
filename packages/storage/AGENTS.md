# @puzzle-ui/storage – AI development instructions

## 1. Responsibility

Defines vendor-neutral storage records, adapter/capability contracts, query language, migration protocol, validation, errors, and reusable adapter conformance tests. It does not implement a database.

## 2. Public API

- `@puzzle-ui/storage`: contracts, types, query validators, and storage errors.
- `@puzzle-ui/storage/testing`: adapter and migration conformance runners.

The export map is in [`package.json`](./package.json); use only its root and `/testing` paths.

## 3. Architecture

Types are grouped under `src/types/`, errors under `src/errors/`, and query validation under `src/utils/`. The testing entry point re-exports conformance suites from `tests/`. Adapters implement the shared contract and report actual capabilities.

## 4. Dependencies

There are no runtime dependencies. Keep database drivers, framework packages, and authentication/session policy out of this contract package.

## 5. Implementation conventions

Do not invent adapter methods or claim guarantees an implementation cannot provide. Keep query and migration semantics database-neutral, capability flags explicit, and conditional-write/revision behavior typed. Validate queries at the shared boundary. Use `StorageSchema` only as documented; it is not automatically invoked by D1 or Mongo adapters.

`StorageRecord.id` remains required, while `StorageInsert<T>` makes only the ID
and adapter metadata optional; record-specific fields retain their types.
Adapters preserve explicit non-empty IDs or use the shared
`resolveStorageId` helper. Insert defaults missing timestamps to now and
revision to 1. Upsert preserves a matched record's ID and creation time,
manages updatedAt/revision, and rejects a conflicting explicit ID. The
`upsert` capability does not imply atomicity.

## 6. Testing

The shared conformance suites cover CRUD/query semantics, serialization, revisions, constraints, pagination, batch atomicity, capabilities, and migrations. Adapter packages should run them against isolated real/test databases. Contract tests live under `tests/`.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run vitest`
- `bun run build`

There is no `test` script in this package manifest; `vitest` currently invokes Node's test runner.

## 8. Documentation

See [`README.md`](./README.md) and the [Storage documentation](../../apps/site/content/docs/storage/index.mdx). Update the adapter contract and conformance guidance together when public semantics change.

## 9. Common mistakes

- Do not put adapter-specific options or database types in shared contracts.
- Do not weaken `StorageRecord` or `StorageUpdate` to support optional insert
  IDs, and do not assume upsert is atomic.
- Do not treat `StorageSchema` as automatic input validation.
- Do not infer transactional or TTL guarantees from an adapter's name; inspect its reported capability and limitations.
- Do not skip the conformance suite when changing adapter-facing contract semantics.

## 10. Context-efficient workflow

Start with [`src/index.ts`](./src/index.ts) and the exact type in `src/types/`. Read `tests/conformance/` only for the contract area being changed; inspect adapters only to confirm compatibility, not to move their implementation here.
