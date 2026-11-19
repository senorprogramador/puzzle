# @puzzle-ui/auth – AI development instructions

## 1. Responsibility

Framework-independent server authentication services for accounts, password sign-in, lifecycle workflows, MFA, passkeys, recovery, and step-up verification. Auth does not own framework routes, browser state, OAuth, application authorization, or ready-made auth pages.

## 2. Public API

All public managers, provider contracts, records, errors, and crypto/TOTP helpers are exported from [`src/index.ts`](./src/index.ts) through `@puzzle-ui/auth`. Check this entry point rather than importing internals.

## 3. Architecture

Managers compose the vendor-neutral `StorageAdapter`, the `SessionManager`, and injected providers such as password hashing, rate limiting, email, and WebAuthn. Keep provider contracts in Auth and framework Request/Response integration in Fullstack.

## 4. Dependencies

Runtime dependencies are `@puzzle-ui/storage`, `@puzzle-ui/session`, and `@simplewebauthn/server`. Do not add a database driver, React, or a web framework. Storage and session capabilities must be supplied by the configured managers.

## 5. Implementation conventions

Preserve security boundaries: keep raw session/challenge tokens server-side and deliver session tokens only through secure HttpOnly cookies; do not return them in browser JSON or store them in local/session storage. Require production-grade password hashing (Argon2id or a peppered supported alternative), shared durable rate limiting, encrypted TOTP secrets, hashed recovery codes, and exact WebAuthn origin/RP ID configuration. Validate inputs and return typed Auth errors; never expose secrets in errors or logs.

## 6. Testing

Tests use Node's `node:test` runner under `tests/`, including unit, integration, cryptographic/provider, lifecycle, MFA, security, and package-boundary coverage. Preserve tests for storage capability and provider failures when changing manager flows.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run build`

`vitest` is also a manifest alias for `node --test`.

## 8. Documentation

See [`README.md`](./README.md), the [Auth documentation](../../apps/site/content/docs/auth/index.mdx), and the [developer authentication guide](../../apps/site/content/docs/developer/authentication.mdx). Update security and integration notes alongside public behavior changes.

## 9. Common mistakes

- Do not trust browser auth state as an authorization boundary.
- Do not assume a storage adapter supports the operations a manager needs; initialize and check the required capability contract.
- Do not send one-time tokens or recovery codes to the browser except through the documented flow.
- Do not add framework route handling here; use `@puzzle-ui/fullstack`.

## 10. Context-efficient workflow

Start at [`src/index.ts`](./src/index.ts), then inspect the one manager, provider contract, and nearby Node tests involved. Read Storage or Session internals only when their contract is directly affected.
