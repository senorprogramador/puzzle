# Changelog

All notable changes to `@puzzle-ui/auth` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.15.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.14.0 - 2026-11-20

- No changes; version bumped in lockstep.

## 0.13.0 - 2026-11-20

- `SimpleWebAuthnProvider` now accepts `supportedAlgorithmIDs`, a list of COSE algorithm IDs. It is validated as a non-empty list of unique IDs and applied to registration and verification. The default is EdDSA, ES256 and RS256. The `SimpleWebAuthnProviderOptions` type is exported.
- Added packaged AI guidance (`ai/` instructions and manifest).

## 0.12.0 - 2026-11-18

- Added an optional `demoTotpBypass` MFA manager option that accepts a fixed TOTP code for a single demo account; invalid configuration throws an `AuthConfigurationError`.

## 0.11.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.1 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.9.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.8.0 - 2026-11-16

- Added `Pbkdf2PasswordHasher`, a Web Crypto PBKDF2-HMAC-SHA256 password hasher with a secret pepper that runs on Node.js, Bun, Deno, and Cloudflare Workers, including the Workers Free plan.
- Added `PasswordHashAlgorithm` and `PASSWORD_HASH_ALGORITHMS`, and `PasswordHash.algorithm` now accepts `pbkdf2-sha256` as well as `argon2id`.
- Auth managers now accept hashes from any supported algorithm and report invalid hasher output with a generic password hash error.

## 0.7.0 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.2 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.1 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.0 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.1 - 2026-11-14

- Reworked package documentation with installation, minimal setup, feature overview, and security guidance.

## 0.5.0 - 2026-11-14

### Added

- Initial release of framework-independent registration, password sign-in, session validation and sign-out, email verification, password reset and change, profile and account lifecycle operations, rate limiting, and audit events.
- Added optional MFA with TOTP and WebAuthn passkeys, recovery codes, required enrollment and policy enforcement, plus step-up authentication for protected operations.
