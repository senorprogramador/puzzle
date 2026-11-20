# @puzzle-ui/storage-mongodb

Use Storage MongoDB as the adapter implementing Puzzle's vendor-neutral Storage
contracts. Install with `npm install @puzzle-ui/storage-mongodb`; the root
exports `MongoStorageAdapter` and `MongoStorageMigrationAdapter`.

Use adapter CRUD methods rather than raw collection names. The default
collection prefix is `puzzle_`; configure `collectionPrefix` when needed.
Multi-document transactions and atomic batches require explicit
`transactionsEnabled` configuration and a compatible MongoDB deployment.

MongoDB TTL deletion is asynchronous; enforce security-sensitive expiry at
request time. Do not infer transaction or atomicity support from the database
name, or import private adapter paths. See the
[Storage documentation](https://puzzle-ui.com/docs/storage).
