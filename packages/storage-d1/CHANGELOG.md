# Changelog

All notable changes to `@puzzle-ui/storage-d1` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.20.0 - 2026-11-25

- Added ID generation: inserts and upserts without an `id` get a UUID v4 from Web Crypto, and explicit IDs are preserved.
- Changed upsert to validate the query first and to reject a different explicit ID for a matched record with `StorageValidationError`.
- Fixed atomic batch inserts to read back the resolved ID, including generated ones.

## 0.19.1 - 2026-11-24

- No changes; version bumped in lockstep.

## 0.19.0 - 2026-11-24

- Added support for nested dotted-path filters and sorts, case-insensitive `contains` matching for strings and arrays, and query validation.
- Fixed null handling in `notEquals`, `in`, `notIn`, `exists` and cursor pagination.
- Fixed an empty `or` group so it matches nothing, and added validation of cursor shape and scalar values.

## 0.18.0 - 2026-11-23

- No changes; version bumped in lockstep.

## 0.17.0 - 2026-11-22

- No changes; version bumped in lockstep.

## 0.16.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.15.0 - 2026-11-21

- Fixed registration of hyphenated index names without relaxing validation of table and other SQL identifiers.

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

- No changes; version bumped in lockstep.

## 0.8.0 - 2026-11-16

- Fixed storing and querying dates nested in documents, so `Date` values are encoded reliably and compared by their ISO string in filters and sorts, including for invalid dates, which now raise a validation error.

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

- Initial release of `D1StorageAdapter`, implementing the shared storage contracts with D1 CRUD, query, conditional-write, pagination, unique-index, and atomic-batch support.
- Added `D1StorageMigrationAdapter` for explicit, versioned migrations and D1 binding and adapter option types.
