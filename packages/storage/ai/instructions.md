# @puzzle-ui/storage

Use Storage for vendor-neutral records, adapter and capability contracts,
querying, migration protocols, validation, and conformance testing. It does not
implement a database.

Install with `npm install @puzzle-ui/storage`. The public entry points are
`@puzzle-ui/storage` and `@puzzle-ui/storage/testing`.

```ts
import type { StorageAdapter } from "@puzzle-ui/storage";
```

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
