# @puzzle-ui/fullstack

Use Fullstack to connect Puzzle Auth, Media, CMS, and Commerce with browser
clients, server handlers, and framework adapters. It adapts the Auth, Session,
Media, CMS, and Commerce packages; it does not own authentication policy,
storage, media processing, CMS schemas/publishing, or payment-provider
credentials.

Install with `npm install @puzzle-ui/fullstack`. There is intentionally no
package-root import. Use only declared subpaths. The current npm release
contains the Auth subpaths; Media and CMS subpaths in this repository await a
coordinated release with their domain packages.

- `@puzzle-ui/fullstack/auth/client` for browser-facing APIs.
- `@puzzle-ui/fullstack/auth/shared` for serializable shared contracts.
- `@puzzle-ui/fullstack/auth/server` for server handlers.
- `@puzzle-ui/fullstack/auth/next` or `/tanstack` only in the matching framework.
- `@puzzle-ui/fullstack/media/client` for browser-safe media operations and
  bounded single-PUT/multipart upload orchestration.
- `@puzzle-ui/fullstack/media/shared` for serializable media API contracts.
- `@puzzle-ui/fullstack/media/server` for authenticated media handlers.
- `@puzzle-ui/fullstack/media/next` or `/tanstack` only in the matching framework.
- `@puzzle-ui/fullstack/cms/client` for browser CMS queries and mutations.
- `@puzzle-ui/fullstack/cms/shared` for serializable CMS API contracts.
- `@puzzle-ui/fullstack/cms/server` for authorized admin and published-content handlers.
- `@puzzle-ui/fullstack/cms/next` or `/tanstack` only in the matching framework.
- `@puzzle-ui/fullstack/payments/shared` for serializable payment API contracts.
- `@puzzle-ui/fullstack/payments/server` for trusted order resolution, payment
  orchestration, idempotency, and webhook processing.

Keep server managers, cookies, storage, media object keys, provider upload IDs,
permanent credentials, and server-only types out of client/shared imports.
Payment server code must resolve totals from trusted orders, never accept
client-supplied amounts or status, and verify webhook authenticity before
deduplicating or applying events.
Protect server resources independently of browser auth state. Resolve actor and
tenant from trusted server context and authorize every server action; never
accept tenant identity or object references from browser input. Next.js and
TanStack Start integrations are optional peers; do not make a framework
integration a requirement for shared APIs.

Media upload intent and finalize are server controlled. Check session tenant
and expiry, then validate object-adapter-reported tenant, size, MIME type, and
checksum before creating an asset. Finalize leaves assets `uploaded`; never
report `ready` without actual processing/validation. Use an atomic, durable
`MediaIdempotencyStore` for finalize replays. All API responses must be
`no-store`.
Configure `verifyUploadedContent` to inspect actual bytes on the immutable
completed object and return true only for accepted content. Without this
optional hook, signatures are not checked. Rejected/failed inspection can
leave completed objects without assets; the host must reconcile them.

Configure tenant quota, per-action rate-limit, readiness, and cleanup hooks in
the media server. Upload tasks may pause at safe boundaries and resume only
after the caller reselects the matching `File`. Persist only the versioned
resume metadata and completed-part ETags; it contains no file bytes, signed
targets, headers, provider IDs, or object keys.
The optional `onAudit` media server callback receives sanitized mutation and
signed-target outcomes, not credentials or request bodies. The host owns audit
storage and queries; this callback is not atomic with the mutation, and direct
domain/worker operations need separate auditing.

The host must provide `assertCanDeleteAsset` for permanent deletion. Media's
own usage records do not include CMS-owned references; the guard must consult
host domains such as CMS and must run before object deletion. Soft delete stays
separate.

CMS server routes require trusted tenant/actor context and explicit
authorization. Keep admin reads/mutations separate from public published
reads, preserve revision conditions, and configure a real scheduler before
accepting scheduled publication. Client query invalidation runs after a
successful mutation; if it fails, surface the committed-mutation error and
refresh before continuing.

Optional CMS webhook routes require a host-managed secret-reference selector,
secret resolver, and SSRF-safe transport. Never accept or return secret
references in browser contracts. Provision/rotate secrets server-side, supply
tenant-scoped policy permissions, and schedule durable outbox and delivery
workers separately; routes do not execute deliveries automatically.

The media client supports bounded single-PUT transfers and server-issued
multipart part targets, progress, transient retry, pause/resume at safe
boundaries, cancellation, and explicit resume metadata. Do not expose provider
multipart IDs or persist signed targets.

Do not import `@puzzle-ui/fullstack` without a subpath or deep-import source
files. See the [Fullstack documentation](https://puzzle-ui.com/docs/fullstack).
