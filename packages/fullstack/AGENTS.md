# @puzzle-ui/fullstack – AI development instructions

## 1. Responsibility

Connects Puzzle Auth, Media, CMS, and commerce/payment services to browser clients, server Request/Response handlers, and Next.js/TanStack Start integrations. It adapts the domain packages; it does not own authentication policy, persistence, media processing, CMS schemas, publishing policy, or provider implementations.

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
- `@puzzle-ui/fullstack/payments/shared`
- `@puzzle-ui/fullstack/payments/server`

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

`src/cms/` follows the same split. The server accepts a static `defineCMS`
configuration and Storage adapter, resolves trusted context per request,
authorizes the route, then creates a request-scoped `createCms` instance with
the explicit domain access policy. Collection and singleton routes derive
from the static schema; there are no runtime content-type registration
endpoints. Keep public reads limited to published snapshots and admin routes
authorized and uncached. The configured CMS lifecycle includes opt-in drafts,
timestamps, nested localization, access policies, and hooks; expose those
operations only through verified shared/client/server contracts.

`src/payments/shared/` contains serializable payment API contracts;
`src/payments/server/` orchestrates trusted order resolution, provider
operations, idempotency, refunds, and webhook processing. Payment APIs are
server-only and delegate provider behavior to `@puzzle-ui/commerce` adapters.

## 4. Dependencies

Runtime dependencies are `@puzzle-ui/ui`, `@puzzle-ui/auth`,
`@puzzle-ui/media`, `@puzzle-ui/cms`, `@puzzle-ui/commerce`,
`@puzzle-ui/session`, and
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
For CMS, resolve tenant/actor from trusted server context for each request and
authorize every route independently from the CMS access policy. Keep admin and
public reads separate, send only published snapshots from public routes, and
preserve revision checks. `delete` is soft; permanent `purge` must require an
expected revision and retain CMS relationship/media-usage protections.
Relationship additions and purge use an atomic target guard, so only existing
or historical incoming references block deletion; capability or bounded-scan
failures remain fail-closed. Do not
accept client-supplied tenant/actor IDs or
runtime content-type registration. Collection and singleton routes derive
from static keys; framework adapters dispatch the same server route map.
Drafts, publication, revisions, scheduling, localization, access, and hooks
belong to the configured lifecycle API; use exact verified contracts and do
not infer method names from Pieces callbacks. Collection access denies omitted
actions; global and collection policies must both allow. `beforeChange` runs
after authorization and may veto before persistence; `afterChange` runs after
commit, so its errors do not roll back a mutation.
Optional webhook routes must not accept or return secret references. The host
selects pre-provisioned references, supplies an SSRF-safe transport, and runs
outbox and delivery workers separately. With `emitChangeEvents: true`, the
server writes metadata-only events, but Fullstack does not expose its
request-scoped CMS instance. It exposes authorized, sanitized change-event
routes when event emission is enabled; the host still runs fanout and delivery
workers separately. Feed event IDs and revisions to webhook fanout. Fanout
records deliveries and removes the consumed event; do not separately
acknowledge it.
Keep no-store responses, typed serializable results, secure auth cookies and
CSRF/origin protections, and explicit error behavior. Keep framework-specific
dispatch in its adapter subpath.

## 6. Testing

Node tests cover auth, media, CMS, and payment client/server routes,
authorization, tenant isolation, upload replay/expiry, pause/resume,
quota/rate-limit, readiness, cleanup, deletion guards, configured CMS
collection/singleton lifecycle routes, and export boundaries.
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

Inspect the target `src/auth/<area>/index.ts`, `src/media/<area>/index.ts`,
`src/cms/<area>/index.ts`, or `src/payments/<area>/index.ts`, then its
implementation and boundary tests. Read `tsdown.config.ts` before changing
entry points; it builds each supported subpath separately.
