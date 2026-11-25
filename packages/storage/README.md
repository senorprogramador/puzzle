# @puzzle-ui/storage

Vendor-neutral storage contracts for Puzzle Auth and other packages. This package defines the typed adapter API, query language, migration protocol, and reusable adapter conformance suites; it does not bundle a database implementation.

CMS content and media metadata can use this record contract. Do not store file
bytes here; `@puzzle-ui/media` defines a separate object-storage adapter for
binary data.

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

const generatedSession = await storage.insert<Session>("sessions", {
  userId: "user_123",
  expiresAt: new Date(Date.now() + 60 * 60 * 1000),
});
const generatedSessionId = generatedSession.id;
```

`getConfiguredStorage` is your own adapter factory. `StorageRecord` always
requires an ID; `StorageInsert` allows it to be omitted. Both built-in adapters
preserve explicit IDs and otherwise assign a cryptographically random UUID v4
using Web Crypto. Insert and upsert return a complete record with a non-empty
ID. Custom adapters can use the shared `resolveStorageId` helper to apply the
same rule.

On insert, missing `createdAt` and `updatedAt` default to the current time and
missing `revision` defaults to 1; explicitly supplied metadata is preserved.
Updates preserve `id` and `createdAt`, set `updatedAt` themselves, and increment
`revision` once. Upsert uses the query to find a record: when found, it keeps
the existing ID and creation time, ignores supplied metadata, and performs one
ordinary update. A different explicit ID for a match is rejected with
`StorageValidationError`. When no record matches, upsert inserts and generates
an ID if needed:

```ts
type Preference = StorageRecord & { key: string; value: string };

const preference = await storage.upsert<Preference>(
  "preferences",
  { where: { key: { operator: "eq", value: "theme" } } },
  { key: "theme", value: "dark" },
);
```

Upsert is a read followed by a write, not a concurrency-safe atomic operation.
The `upsert` capability indicates operation support only. Use unique constraints
and handle duplicate errors when concurrent calls must not create duplicates.

The query AST supports comparisons, nested boolean conditions, sorting,
offset/limit, and cursor pagination. Filters and sorts can use validated dotted paths through nested JSON objects:

```ts
type Post = StorageRecord & {
  author: { displayName: string; roles: readonly string[] };
};

const page = await storage.findMany<Post>("posts", {
  where: {
    "author.displayName": { operator: "contains", value: "ada" },
    "author.roles": { operator: "contains", value: "editor" },
  },
  orderBy: [{ field: "author.displayName", direction: "asc" }],
  limit: 25,
});
```

`contains` is case-insensitive substring matching for strings and exact scalar-element membership for arrays. It does not match object values inside arrays or traverse array indexes in dotted paths. Path segments must be valid identifier names; malformed or unsupported paths are rejected. D1 uses SQLite `lower()`, which provides ASCII-only case folding. Conditional writes use expected revisions or update times; adapters advertise guarantees through capability reports. Migrations are explicit and versioned.

## Entry points

- `@puzzle-ui/storage`: storage types, adapter and migration contracts, query validators, ID resolution, and storage errors.
- `@puzzle-ui/storage/testing`: Bun conformance suites for adapter and migration implementations.

The conformance kit checks CRUD and query semantics, generated and explicit
IDs, serialization, revisions, constraints, pagination, batch atomicity,
capabilities, and migration behavior. Adapters should run it against isolated
test databases before release. `bun run typecheck` also checks the conformance
sources with Bun test types.

`StorageSchema` provides an optional type-guard shape, but the shipped D1 and MongoDB adapters do not invoke it automatically; validate untrusted records at your application boundary.

## Development

```sh
bun run build
bun run typecheck
```

See the [storage guide](https://puzzle-ui.com/docs/storage) for contract details, migrations, adapter setup, and custom-adapter guidance.
