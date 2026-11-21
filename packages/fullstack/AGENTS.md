# @puzzle-ui/fullstack – AI development instructions

## 1. Responsibility

Connects Puzzle Auth, Media, and CMS services to browser clients, server Request/Response handlers, and Next.js/TanStack Start integrations. It adapts the domain packages; it does not own authentication policy, persistence, media processing, CMS schemas, or publishing policy.

## 2. Public API

There is intentionally no package-root export. Use only:

- `@puzzle-ui/fullstack/auth/client`
- `@puzzle-ui/fullstack/auth/shared`
- `@puzzle-ui/fullstack/auth/server`
- `@puzzle-ui/fullstack/auth/next`
- `@puzzle-ui/fullstack/auth/tanstack`
- `@puzzle-ui/fullstack/media/shared`
- `@puzzle-ui/fullstack/media/client`
- `@puzzle-ui/fullstack/media/server`
- `@puzzle-ui/fullstack/media/next`
- `@puzzle-ui/fullstack/media/tanstack`
- `@puzzle-ui/fullstack/cms/client`
- `@puzzle-ui/fullstack/cms/shared`
- `@puzzle-ui/fullstack/cms/server`
- `@puzzle-ui/fullstack/cms/next`
- `@puzzle-ui/fullstack/cms/tanstack`

Verify which subpath is safe for the importing environment before adding imports.

## 3. Architecture

`src/auth/client/` contains the browser client, React provider/hooks/components, and passkey browser helpers; `src/auth/shared/` contains serializable contracts; `src/auth/server/` builds handlers around Auth/Session managers; `src/auth/next/` and `src/auth/tanstack/` dispatch auth routes.

`src/media/shared/` contains serializable, sanitized API contracts;
`src/media/client/` contains the browser client and bounded single-PUT/multipart
upload queue with safe pause/resume metadata; `src/media/server/` composes
public `@puzzle-ui/media` services behind server-side actor, tenant,
authorization, quota/rate-limit, readiness, idempotency, cleanup, and
deletion-guard callbacks. The media framework subpaths dispatch that route map
without browser dependencies.

`src/cms/` follows the same split. Its server handlers compose `CmsService`
with trusted actor/tenant context, explicit access policy, and a scheduler;
public endpoints expose only published snapshots while admin endpoints remain
authorized and uncached.

## 4. Dependencies

Runtime dependencies are `@puzzle-ui/ui`, `@puzzle-ui/auth`,
`@puzzle-ui/media`, `@puzzle-ui/cms`, `@puzzle-ui/session`, and
`@simplewebauthn/browser`. React
19 and React DOM 19 are peers. Next.js 15/16 and TanStack Start 1.x are
optional peers for their adapters; do not make them required for
framework-neutral subpaths.

## 5. Implementation conventions

Never expose server managers, storage adapters, cookies, object keys, provider
upload IDs, permanent credentials, or server-only types through client/shared
exports. Client state is not authorization: resolve actor/tenant and authorize
each server operation. Media finalize must verify upload tenant/expiry and
object metadata, remain `uploaded` until actual processing succeeds, and use
durable idempotency. Keep resumable client metadata free of files, signed
targets, headers, provider IDs, and object keys. Require a host
content-inspection callback when actual file signatures must be checked;
metadata alone does not establish file contents. The optional
`verifyUploadedContent` runs before asset creation and must fail closed.
Require a host `assertCanDeleteAsset` guard before
permanent deletion because CMS usages live outside Media's usage collection.
Media `onAudit` events are sanitized HTTP-operation outcomes; the host owns
durable storage and direct domain/worker auditing. Never imply atomicity with
the media mutation.
For CMS, keep admin and public reads separate, send only published snapshots
from public routes, preserve revision checks, and require the host scheduler
for scheduled publication.
Optional webhook routes must not accept or return secret references. The host
selects pre-provisioned references, supplies an SSRF-safe transport, and runs
outbox and delivery workers separately.
Keep no-store responses, typed serializable results, secure auth cookies and
CSRF/origin protections, and explicit error behavior. Keep framework-specific
dispatch in its adapter subpath.

## 6. Testing

Node tests cover auth, media, and CMS client/server routes, authorization,
tenant isolation, upload replay/expiry, pause/resume, quota/rate-limit,
readiness, cleanup, deletion guards, publishing, and export boundaries.
Browser tests use Vitest with Chromium/Playwright for the auth
experience and real interactions. Keep client/server export-boundary tests
when adding modules.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run test:browser`
- `bun run vitest`
- `bun run build`

`vitest` runs the Node suite and the browser-configured Vitest suite.

## 8. Documentation

See [`README.md`](./README.md), [`ai/instructions.md`](./ai/instructions.md),
the [Fullstack documentation](../../apps/site/content/docs/fullstack/index.mdx),
and the [developer authentication guide](../../apps/site/content/docs/developer/authentication.mdx). Document the correct subpath and server/client requirements for each new public API.

## 9. Common mistakes

- Do not import from `@puzzle-ui/fullstack` without a subpath.
- Do not let a client entry transitively import a server module or expose server manager types.
- Do not rely on browser state for access control.
- Do not accept client-supplied tenant IDs or object references in Media routes.
- Do not mark finalized assets ready before actual processing/validation.
- Do not permanently delete an asset without the host reference guard.
- Do not add framework dependencies to the shared server or client APIs.

## 10. Context-efficient workflow

Inspect the target `src/auth/<area>/index.ts` or `src/media/<area>/index.ts`,
then its implementation and boundary tests. Read `tsdown.config.ts` before
changing entry points; it builds each supported subpath separately.
