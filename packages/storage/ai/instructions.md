# @puzzle-ui/storage

Use Storage for vendor-neutral records, adapter and capability contracts,
querying, migration protocols, validation, and conformance testing. It does not
implement a database.

Install with `npm install @puzzle-ui/storage`. The public entry points are
`@puzzle-ui/storage` and `@puzzle-ui/storage/testing`.
`resolveStorageId` is a root runtime helper for adapter implementations.

```ts
import type { StorageAdapter } from "@puzzle-ui/storage";
```

`StorageRecord.id` is required. `StorageInsert<T>` allows its ID to be omitted
without weakening record-specific field types. Adapters preserve supplied
non-empty IDs or use `resolveStorageId` to generate a cryptographically random
Web Crypto UUID v4. Successful insert/upsert results always include a
non-empty ID. Missing `createdAt`/`updatedAt` default to now and missing
`revision` defaults to 1; explicit insert metadata is preserved.

Upsert uses the query to find a record. A match keeps its ID and `createdAt`,
ignores supplied metadata, sets `updatedAt`, and increments `revision` exactly
once. A different explicit ID for a match is rejected. No match inserts with
the supplied ID or a generated one. Both built-in adapters use read-then-write
semantics: the `upsert` capability indicates operation support, not atomicity
or concurrency safety.

Choose a database adapter separately and check the capabilities it actually
reports. Use the shared query and migration contracts. Queries accept validated dotted
paths through nested JSON objects, and `contains` means case-insensitive string
substring matching or exact scalar membership for arrays. Do not rely on dotted
paths traversing arrays or on `contains` matching object values. D1's SQLite
`lower()` only provides ASCII case folding. Treat `StorageSchema` only as
documented, not as automatic input validation.
Use Storage for media metadata and CMS records, not binary file bytes; media
bytes belong in the separate `@puzzle-ui/media` object-storage contract.

Do not put database-specific options or authentication policy in the shared
contract, or assume transactional, conditional-write, or TTL guarantees. See
the [Storage documentation](https://puzzle-ui.com/docs/storage).
