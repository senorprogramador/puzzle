# @puzzle-ui/storage-d1

Use Storage D1 as the adapter implementing Puzzle's vendor-neutral Storage
contracts on a D1-compatible binding. Install with
`npm install @puzzle-ui/storage-d1`; the package root exports
`D1StorageAdapter` and `D1StorageMigrationAdapter` with D1-like types.

Supply the runtime's D1 binding and use the shared query, capability, and
migration contracts. The default table prefix is `puzzle_`; configure
`tablePrefix` when isolation requires it. Run versioned migrations through
deployment/startup orchestration, not per request.

D1 does not provide native TTL indexes. Enforce expiry in application logic;
do not claim TTL or transaction guarantees absent from the adapter contract.
Do not import private implementation paths. See the
[Storage documentation](https://puzzle-ui.com/docs/storage).

`StorageInsert` allows an omitted ID; preserve explicit non-empty IDs or use
the shared `resolveStorageId` helper to generate the same Web Crypto UUID v4 as
MongoDB. Use the resolved ID consistently in SQL and returned insert/batch
records. Upsert preserves a matched record's ID and `createdAt`, manages
`updatedAt`/revision, and rejects a different explicit ID. Query-based upsert
is read-then-write, so the `upsert` capability indicates operation support,
not atomicity.
