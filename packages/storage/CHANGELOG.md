# Changelog

All notable changes to `@puzzle-ui/storage` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.21.0 - 2026-11-25

- No changes; version bumped in lockstep.

## 0.20.0 - 2026-11-25

- Added optional `id` on `StorageInsert`, so records can be inserted without an ID and adapters generate one.
- Added the `resolveStorageId` helper, exported from `@puzzle-ui/storage`. It keeps explicit IDs, generates a Web Crypto UUID v4 when none is given, and rejects empty IDs with `StorageValidationError`. Custom adapters can use it.
- Documented insert and upsert semantics: insert defaults missing timestamps to now and revision to 1, and upsert keeps the matched record's ID and `createdAt`. A different explicit ID on a matched record is rejected. Upsert is a read followed by a write, not concurrency-safe.
- Updated the conformance kit to cover generated and explicit IDs, upsert behavior, and atomic batch inserts.

## 0.19.1 - 2026-11-24

- No changes; version bumped in lockstep.

## 0.19.0 - 2026-11-24

- Added validated dotted-path field filtering and sorting for nested JSON objects in the query AST, with exported scalar field-path types and path validation utilities.
- Added case-insensitive substring and scalar array-element membership semantics to the `contains` operator, and extended the conformance tests to cover nested paths, null handling, and cursor pagination.

## 0.18.0 - 2026-11-23

- No changes; version bumped in lockstep.

## 0.17.0 - 2026-11-22

- No changes; version bumped in lockstep.

## 0.16.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.15.0 - 2026-11-21

- Documented that CMS content and media metadata can use the storage record contract, while file bytes belong in the separate `@puzzle-ui/media` object-storage adapter.

## 0.14.0 - 2026-11-20

- No changes; version bumped in lockstep.

## 0.13.0 - 2026-11-20

- Enabled `isolatedDeclarations` and oxc declaration generation for the build, and kept `bun:test` external. Conformance suites were adjusted to match.
- Added packaged AI guidance (`ai/` instructions and manifest).

## 0.12.0 - 2026-11-18

- No changes; version bumped in lockstep.

## 0.11.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.1 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.9.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.8.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.7.0 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.2 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.1 - 2026-11-15

- Fixed the build so the `src/testing` entry point is bundled and every declared export target is built, with a new test verifying this.
- Updated package metadata with a docs homepage and keywords.

## 0.6.0 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.1 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.0 - 2026-11-14

### Added

- Initial release of vendor-neutral storage contracts for typed records and collections, CRUD and conditional writes with revision-based concurrency, query filtering and cursor pagination, capabilities, atomic batches, schemas and indexes, and explicit migrations.
- Exported shared storage errors, query validators, and reusable adapter and migration conformance suites.
