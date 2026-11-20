# @puzzle-ui/workspace – AI development instructions

## 1. Responsibility

Private, framework-neutral Workspace domain package for models, validation, storage schemas, authorization-aware services, and shared HTTP handling. It is not a framework app or database adapter.

## 2. Public API

- `@puzzle-ui/workspace` and `/client` expose client-safe models, validation, and collection constants.
- `@puzzle-ui/workspace/server` exposes storage initialization, services, and the shared Request/Response API handler.

The root intentionally re-exports only client-safe contracts. Keep server imports on `/server`; never export them through the root/client entry.

## 3. Architecture

Models and Zod validation are shared. Server services depend on a supplied `StorageAdapter` and verified user ID; framework apps supply the authenticated identity, origin protection, storage, and optional invitation delivery. The services enforce membership and record activity with mutations in atomic batches.

## 4. Dependencies

Runtime dependencies are `@puzzle-ui/session`, `@puzzle-ui/storage`, and Zod. Auth and MongoDB storage are development dependencies for tests, not runtime imports. Do not add a framework or database driver.

## 5. Implementation conventions

Validate request input at the framework boundary and again in services. A caller-supplied workspace ID is only a lookup key, never proof of access; check active membership server-side before reading tenant data. Preserve atomic mutation/activity writes, role restrictions, invitation email verification, and response redaction. Never return invitation tokens, storage internals, cookies, or Auth secrets to clients.

## 6. Testing

Tests under `tests/` use Bun and a fake `StorageAdapter`. Cover validation, authorization, capability failures, atomic operations, invitation lifecycle, activity, and shared handler semantics.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run build`

## 8. Documentation

There is no package README. Use [`docs/workspace/architecture.md`](../../docs/workspace/architecture.md) and [`docs/workspace/apps.md`](../../docs/workspace/apps.md) as the architecture and integration references. Update them when client/server or service contracts change.

## 9. Common mistakes

- Do not import `/server` from browser code or re-export it from the package root.
- Do not trust a workspace ID without checking the current user's membership.
- Do not add Auth or an adapter implementation as a runtime dependency.
- Do not let the client author audit activity or receive raw invitation tokens.

## 10. Context-efficient workflow

Read `src/client.ts` or `src/server.ts` first, then the target service/model/validation module and its test. Consult the Workspace architecture doc before changing a security, tenancy, or client/server boundary.
