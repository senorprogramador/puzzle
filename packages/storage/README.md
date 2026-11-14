# @puzzle-ui/storage

Vendor-neutral storage contracts for Puzzle Auth and other packages. This package defines the typed adapter API, query language, migration protocol, and reusable adapter conformance suites; it does not bundle a database implementation.

**Documentation: [puzzle-ui.com/docs/storage](https://puzzle-ui.com/docs/storage)**

## Install

```sh
npm install @puzzle-ui/storage
# or: bun add @puzzle-ui/storage
```

Add a database adapter when you need an implementation: [`@puzzle-ui/storage-d1`](https://puzzle-ui.com/docs/storage#cloudflare-d1-adapter) for Cloudflare D1 or [`@puzzle-ui/storage-mongodb`](https://puzzle-ui.com/docs/storage#mongodb-adapter) for MongoDB.

## Use

Define record types by extending `StorageRecord`, then use an adapter supplied by your application:

```ts
import type { StorageAdapter, StorageRecord } from "@puzzle-ui/storage";

type Session = StorageRecord & { userId: string; expiresAt: Date };

const storage: StorageAdapter = getConfiguredStorage();
await storage.registerCollection<Session>({
  name: "sessions",
  indexes: [{ name: "by-user", fields: ["userId"] }],
});

const session = await storage.insert<Session>("sessions", {
  id: "session_123",
  userId: "user_123",
  expiresAt: new Date(Date.now() + 60 * 60 * 1000),
});
```

`getConfiguredStorage` is your own adapter factory. Records have an ID, creation/update timestamps, and a revision. The query AST supports comparisons, nested boolean conditions, sorting, offset/limit, and cursor pagination. Conditional writes use expected revisions or update times; adapters advertise guarantees through capability reports. Migrations are explicit and versioned.

## Entry points

- `@puzzle-ui/storage`: storage types, adapter and migration contracts, query validators, and storage errors.
- `@puzzle-ui/storage/testing`: Bun conformance suites for adapter and migration implementations.

The conformance kit checks core CRUD/query semantics, serialization, revisions, constraints, pagination, batch atomicity, capabilities, and migration behavior. Adapters should run it against isolated test databases before release. `bun run typecheck` also checks the conformance sources with Bun test types.

`StorageSchema` provides an optional type-guard shape, but the shipped D1 and MongoDB adapters do not invoke it automatically; validate untrusted records at your application boundary.

## Development

```sh
bun run build
bun run typecheck
```

See the [storage guide](https://puzzle-ui.com/docs/storage) for contract details, migrations, adapter setup, and custom-adapter guidance.
