# Changelog

All notable changes to `@puzzle-ui/session` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## Unreleased

### Changed

- Expanded package documentation with direct-use scenarios, documentation links, and npm, pnpm, and yarn installation instructions.

## 0.5.0 - 2026-11-14

### Added

- Initial release of secure, database-independent session management: opaque tokens with SHA-256 hashing, anonymous and authenticated sessions, idle and absolute expiration, rotation and revocation, device listing, maximum-session policies, namespaced TTL data, allowlisted anonymous migration, secure cookies, and origin validation with CSRF protection.
