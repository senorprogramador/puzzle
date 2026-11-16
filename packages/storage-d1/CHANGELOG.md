# Changelog

All notable changes to `@puzzle-ui/storage-d1` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

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
