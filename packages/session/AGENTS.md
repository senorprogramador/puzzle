# @puzzle-ui/session – AI development instructions

## 1. Responsibility

Provides database-neutral server session lifecycle, validation, rotation, revocation, session data, cookie serialization, and CSRF/origin helpers. It does not own authentication policy or framework request adapters.

## 2. Public API

The root `@puzzle-ui/session` API is declared in [`src/index.ts`](./src/index.ts): managers, storage initialization, token utilities, cookie/CSRF helpers, errors, and types. There are no documented subpaths.

## 3. Architecture

`StorageSessionManager` uses shared Storage contracts and advertises the capabilities it requires. Session data and anonymous-to-authenticated migration have separate managers. Storage records contain token hashes, not plaintext session tokens.

## 4. Dependencies

`@puzzle-ui/storage` is the only runtime dependency. Keep session logic free of React, framework, and database-driver imports; adapters provide persistence.

## 5. Implementation conventions

Preserve cryptographically random opaque tokens, SHA-256 token hashes, idle and absolute expiration, atomic rotation/revocation, and fail-closed behavior when unique constraints, conditional writes, or atomic batches are unavailable. Keep tokens in secure HttpOnly cookies, validate origins and state-changing requests, and preserve namespace/size allowlists for session data migration.

## 6. Testing

Tests use Node's `node:test` runner in `tests/`. Cover crypto, cookie and CSRF behavior, expiration/rotation, session data, migration constraints, and architecture boundaries.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run build`

`vitest` is also a manifest alias for `node --test`.

## 8. Documentation

See [`README.md`](./README.md) and the [Auth/session documentation](../../apps/site/content/docs/auth/index.mdx). Update cookie, CSRF, capability, or lifecycle guidance when those contracts change.

## 9. Common mistakes

- Never add a plaintext `token` field to a persisted session record.
- Do not proceed when required storage capabilities are missing.
- Do not assume TTL cleanup is a substitute for validating expiration on each request.
- Do not mix framework cookie APIs into this package; keep serialization and environment input explicit.

## 10. Context-efficient workflow

Read [`src/index.ts`](./src/index.ts), the relevant manager or helper, and its focused tests. Consult [`session-architecture.test.mjs`](./tests/session-architecture.test.mjs) before changing a security or package-boundary invariant.
