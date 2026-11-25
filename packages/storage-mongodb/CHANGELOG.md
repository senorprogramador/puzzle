# Changelog

All notable changes to `@puzzle-ui/storage-mongodb` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.20.0 - 2026-11-25

- Added ID generation: inserts and upserts without an `id` get a UUID v4 from Web Crypto, and explicit IDs are preserved.
- Changed upsert to reject a different explicit ID for a matched record with `StorageValidationError`. It now throws `StorageConflictError` if the matched record disappears before the update, instead of returning the stale record.
- Fixed transactional batch inserts to resolve their IDs and documents before the transaction starts.

## 0.19.1 - 2026-11-24

- No changes; version bumped in lockstep.

## 0.19.0 - 2026-11-24

- Added support for nested dotted-path filters and sorts, and case-insensitive `contains` matching for strings and arrays.
- Hardened cursor pagination with scalar-value validation and date-safe cursor encoding.

## 0.18.0 - 2026-11-23

- No changes; version bumped in lockstep.

## 0.17.0 - 2026-11-22

- No changes; version bumped in lockstep.

## 0.16.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.15.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.14.0 - 2026-11-20

- No changes; version bumped in lockstep.

## 0.13.0 - 2026-11-20

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

- The package's MongoDB test script now starts its replica set on a free localhost port (override with `MONGODB_TEST_PORT`) so it no longer conflicts with a local MongoDB on port 27017.

## 0.8.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.7.0 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.2 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.1 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.0 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.1 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.0 - 2026-11-14

### Added

- Initial release of `MongoStorageAdapter`, implementing the shared storage contracts with MongoDB CRUD, query, conditional-write, pagination, unique-index, and TTL-index support; multi-document transactions and atomic batches are opt-in.
- Added `MongoStorageMigrationAdapter` for explicit, versioned migrations and MongoDB adapter option types.
