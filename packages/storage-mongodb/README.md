# @puzzle-ui/storage-mongodb

A MongoDB implementation of the vendor-neutral contracts from `@puzzle-ui/storage`. It provides CRUD, shared query operators, conditional writes, cursor pagination, unique and TTL indexes, and versioned migrations. MongoDB's multi-document transactions and atomic batches are opt-in.

**Documentation: [puzzle-ui.com/docs/storage](https://puzzle-ui.com/docs/storage#mongodb-adapter)**

## Install

```sh
npm install @puzzle-ui/storage @puzzle-ui/storage-mongodb
# or: bun add @puzzle-ui/storage @puzzle-ui/storage-mongodb
```

## Use

```ts
import { MongoClient } from "mongodb";
import { MongoStorageAdapter } from "@puzzle-ui/storage-mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const storage = new MongoStorageAdapter({
  database: client.db("app"),
  client,
  transactionsEnabled: true,
});

await storage.registerCollection({
  name: "sessions",
  indexes: [{ name: "by-user", fields: ["userId"] }],
});
```

Use a replica set or sharded deployment for multi-document transactions. Pass the client and set `transactionsEnabled: true` to opt in; otherwise `atomicBatch` is not available. The default collection prefix is `puzzle_`; set `collectionPrefix` to change it. A `StorageIndex` with `expireAfterSeconds` creates a MongoDB TTL index; TTL deletion is asynchronous, so enforce security-sensitive expiry in application logic as well. Close the client during application shutdown.

`MongoStorageMigrationAdapter` stores versioned migration status and a shared migration lock in prefixed collections. See the [storage guide](https://puzzle-ui.com/docs/storage) for adapter guarantees, index behavior, migration options, and custom adapter testing.

## Development

```sh
bun run build
bun run typecheck
bun run test
```

The test script requires Docker and Docker Compose; it starts a MongoDB replica set for adapter tests.
