# @puzzle-ui/storage-d1

A Cloudflare D1 implementation of the vendor-neutral contracts from `@puzzle-ui/storage`. It adapts a D1 binding for CRUD, the shared query AST, conditional writes, cursor pagination, unique indexes, atomic batches, and versioned migrations. D1 does not provide native TTL indexes; handle expiry with application logic or scheduled cleanup.

**Documentation: [puzzle-ui.com/docs/storage](https://puzzle-ui.com/docs/storage#cloudflare-d1-adapter)**

## Install

```sh
npm install @puzzle-ui/storage @puzzle-ui/storage-d1
# or: bun add @puzzle-ui/storage @puzzle-ui/storage-d1
```

## Use a Wrangler D1 binding

Configure a database binding (here named `DB`) in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "app-db"
database_id = "<database-id>"
```

Then pass the Worker environment binding to the adapter:

```ts
import { D1StorageAdapter } from "@puzzle-ui/storage-d1";

const storage = new D1StorageAdapter({ database: env.DB });
await storage.registerCollection({ name: "sessions" });
```

The default table prefix is `puzzle_`; set `tablePrefix` to change it. `D1StorageMigrationAdapter` runs explicit, versioned migrations and manages its own prefixed migration/lock tables. These are adapter-managed migrations, not Wrangler SQL migrations. Run them in deployment or startup orchestration, not on every request.

The package exports `D1StorageAdapter`, `D1StorageMigrationAdapter`, and the D1-like binding, statement, result, and options types. See the [storage guide](https://puzzle-ui.com/docs/storage) for query and migration examples, capability details, and production guidance.

## Development

```sh
bun run build
bun run typecheck
bun run test
```
