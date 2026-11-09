# @puzzle-ui/storage

Vendor-neutral storage contracts for Puzzle.

This package defines the persistence API used by Puzzle Auth and other
packages. It does not depend on a database vendor, database SDK, framework,
or runtime-specific implementation.

## Responsibilities

- Typed collection and record contracts.
- Query AST and cursor pagination contracts.
- CRUD, upsert and conditional write contracts.
- Optimistic concurrency through record revisions.
- Capability discovery.
- Atomic batch contract.
- Collection schemas and index definitions.
- Migration contracts and migration status.
- Reusable adapter conformance requirements.

## Architecture

Database-specific implementations belong in separate packages:

- `@puzzle-ui/storage-mongodb`
- `@puzzle-ui/storage-d1`

Neither adapter may leak its database SDK or query language through this
package.

## Records

Every persisted record has:

- `id`
- `createdAt`
- `updatedAt`
- `revision`

The revision is incremented by successful updates. Adapters must use it
for optimistic concurrency when a caller supplies `expectedRevision`.

## Atomicity

An adapter may advertise `atomicBatch: true` only when it guarantees
all-or-nothing execution.

If a batch fails, all changes made by that batch must be rolled back.
Adapters without this guarantee must reject `atomicBatch` calls with
`StorageAtomicityError`.

Security-critical operations must fail closed when the required
capability is unavailable.

## Query contract

Queries use a vendor-neutral AST:

- `eq`, `ne`
- `in`, `notIn`
- `gt`, `gte`, `lt`, `lte`
- `exists`
- nested `and` and `or`
- ordering
- offset and limit
- cursor pagination

Adapters are responsible for translating this AST into their native
query mechanism without changing its semantics.

## Schemas and indexes

Collection schemas validate records at the storage boundary.

Indexes can declare:

- Multiple indexed fields.
- Uniqueness.
- TTL expiration.

An adapter must report unsupported index capabilities instead of
silently ignoring requested guarantees.

## Migrations

Migrations are explicit and versioned. They are never run implicitly
during ordinary reads or writes.

A migration adapter must provide durable migration status and prevent
concurrent migration runners from applying the same migration twice.

## Adapter requirements

Every production adapter must pass the same conformance suite.

At minimum, conformance must verify:

- CRUD and upsert semantics.
- Query operator semantics.
- Serialization of dates and null values.
- Conditional writes and revision conflicts.
- Unique constraint behavior.
- Cursor pagination.
- Atomic batch rollback.
- Capability reporting.
- Migration ordering and concurrency.

## Build

```sh
bun run build
bun run typecheck
```

The typecheck includes all files under `tests/conformance` and loads Bun's
test types for their `bun:test` imports.

This package contains contracts only. It does not provide a production
database implementation or an in-memory persistence implementation.
