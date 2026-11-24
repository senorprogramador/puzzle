# @puzzle-ui/fullstack

[Documentation: https://puzzle-ui.com/docs/fullstack](https://puzzle-ui.com/docs/fullstack)

`@puzzle-ui/fullstack` connects Puzzle Auth, Media, CMS, and commerce/payment
services to browser clients, server routes, and framework adapters. Use its
explicit subpaths for browser-safe clients, serializable contracts, server
handlers, or framework dispatchers; configure auth policy, storage, media
processing, CMS access policy, sessions, and payment providers with the
lower-level packages.

## Install

```bash
npm install @puzzle-ui/fullstack react react-dom
```

React and React DOM 19 are required peer dependencies. `next` (15 or 16) and `@tanstack/react-start` are optional peers for their respective adapters. On the server, configure the managers from `@puzzle-ui/auth` and `@puzzle-ui/session` with your storage backend. See the [Auth docs](https://puzzle-ui.com/docs/auth), [Storage docs](https://puzzle-ui.com/docs/storage), and [developer authentication guide](https://puzzle-ui.com/docs/developer/authentication).

The published package includes the Auth, Media, CMS, and Payments subpaths
listed below. Keep framework imports on the matching `/next` or `/tanstack`
subpath; there is no package-root export.

## Payments

The payments server subpath orchestrates the provider-independent contracts
from `@puzzle-ui/commerce`. It resolves order totals from trusted server-side
storage and never accepts client-supplied amounts or payment status:

```ts
import { PaymentServer } from "@puzzle-ui/fullstack/payments/server";

export const payments = new PaymentServer({
  registry,
  store,
  idempotency,
  webhooks,
  resolveWebhookSecret: (provider) => secrets.get(`payments/${provider}`),
});
```

Use `createPayment` for a payment attempt, `createCheckoutSession` for hosted
checkout, and the capture, cancel, refund, and webhook methods for subsequent
server operations. Every mutation requires a caller-owned idempotency key.
Webhook authenticity must be verified by the configured provider adapter before
events are deduplicated and applied.

Provider implementations are intentionally separate:
`@puzzle-ui/payment-providers/stripe`, `/mollie`, `/paypal`, and `/adyen`.
These adapters are server-only and use platform `fetch`; keep credentials and
webhook secrets in the host's secret manager.

## Client

Wrap the application in `AuthProvider`, then use the hooks or exported forms below it:

```tsx
import { AuthProvider, useAuth, useUser } from "@puzzle-ui/fullstack/auth/client";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider options={{ basePath: "/api/auth" }}>{children}</AuthProvider>
);

export const Account = () => {
  const user = useUser();
  const { signOut } = useAuth();

  return user ? <button onClick={() => void signOut()}>{user.email} · Sign out</button> : null;
};
```

The client provides auth state and actions, sign-in/sign-up and MFA components, `AuthExperience` for branded registration flows, locale helpers, and passkey browser helpers. Browser state is not an authorization boundary; protect server resources independently.

## Auth server and framework adapters

Create one server instance from configured auth and session managers, then register its routes:

```ts
import { createAuthServer, createAuthRouteHandlers } from "@puzzle-ui/fullstack/auth/server";

export const authServer = createAuthServer({
  auth,
  mfa,
  stepUp,
  sessions,
  cookie,
  csrf,
  resolveClientIp,
});

export const authRoutes = createAuthRouteHandlers(authServer);
```

Use `@puzzle-ui/fullstack/auth/next` for Next.js `GET`/`POST` route handlers or `@puzzle-ui/fullstack/auth/tanstack` to create a TanStack Start Request dispatcher. Configure cookies, CSRF, storage and trusted proxy IP resolution in the server layer. Do not expose server managers to browser bundles.

## Media server and framework adapters

Media endpoints compose the public `@puzzle-ui/media` asset, folder, processing,
and object-storage contracts. Resolve the actor and tenant from trusted server
session context, and authorize every request on the server. Never accept a
tenant ID, object key, or provider upload ID from the browser.

```ts
import { createMediaServer } from "@puzzle-ui/fullstack/media/server";

export const mediaServer = createMediaServer({
  assets,
  folders,
  objectStorage,
  idempotency, // durable atomic MediaIdempotencyStore implementation
  resolveContext: (request) => resolveMediaActorAndTenant(request),
  authorize: ({ context, action, resourceId }) =>
    mediaPermissions.can(context, action, resourceId),
  verifyUploadedContent: ({ object, context }) =>
    mediaContentInspector.verify({ object, tenantId: context.tenantId }),
  // Consult every host-owned reference, including CMS usage records.
  assertCanDeleteAsset: async ({ asset, context }) => {
    await cmsMediaReferences.assertAssetUnused({
      tenantId: context.tenantId,
      assetId: asset.id,
    });
  },
});
```

The server returns only sanitized asset/folder views; object references and
provider state remain server-side. Upload intent and completion are server
controlled. Completion checks the object adapter's actual tenant, size, MIME
type, and checksum metadata, and creates an `uploaded` asset. It never marks an
asset `ready`; a configured media processing worker must validate/process it.
Signed upload/read targets are short-lived bearer capabilities and responses
are always `no-store`.

Configure `verifyUploadedContent` to inspect the completed object's actual
bytes and return `true` only for acceptable content matching its reported MIME
type. The callback runs after metadata verification and before asset creation;
`false` rejects the upload and errors or non-boolean results fail closed. For
backward compatibility it is optional: without it, Fullstack does **not**
verify file signatures. The host must inspect an immutable object version,
enforce its own content policy, and reconcile completed objects left without
assets after rejection or failure. The idempotency store must release failed
operations for retry, and cleanup must not race with retries or delete
referenced objects. Direct domain operations need the same validation
separately.

The server also accepts per-action rate-limit and tenant-quota hooks, exposes
readiness checks for configured storage/queue/processor dependencies, and
provides a cleanup hook for expired uploads and host-owned reconciliation.
Readiness is `unverified` when an optional configured dependency has no probe.

Permanent asset deletion requires the host-provided `assertCanDeleteAsset`
guard. The media package's own usage collection cannot see CMS references, so
the host must block deletion while any such reference remains. Soft deletion
does not call this permanent-deletion guard. A custom `MediaAssetService` must
honor `get(tenantId, assetId, { includeDeleted: true })` so the authorized purge
route can check the guard after soft deletion.

Use `@puzzle-ui/fullstack/media/next` for Next.js route handlers or
`@puzzle-ui/fullstack/media/tanstack` for a TanStack Start Request dispatcher.
The default server base path is `/api/media`.

The optional `onAudit` server callback receives sanitized, tenant-scoped
mutation and signed-target outcomes after trusted context resolution. The host
owns durable storage, authorized queries, retention, and monitoring. It does
not receive request bodies, signed URLs, headers, or object keys. It is not
atomic with domain mutations: an audit failure returns 503 and the operation
may already have committed, so refresh before retrying. Direct domain or
worker operations bypass this HTTP hook and need their own audit integration.
`createMediaAuditService` can persist and query these events using an explicit
host authorization policy and a trusted write principal.

## Media browser client

```ts
import {
  createMediaClient,
  createMediaUploadQueue,
} from "@puzzle-ui/fullstack/media/client";

const media = createMediaClient({ basePath: "/api/media" });
const uploads = createMediaUploadQueue(media, {
  maxConcurrentUploads: 3,
  maxRetries: 2,
});

const asset = await uploads.upload(
  {
    file,
    kind: "image",
    metadata: { altText: "A landscape" },
  },
  {
    signal: controller.signal,
    onProgress: ({ percent, phase }) => updateProgress(phase, percent),
  },
);
```

The queue bounds concurrent transfers, reports progress, retries eligible
transient failures, and accepts an `AbortSignal`. Upload tasks support pause
at safe boundaries, resume with the original file reselected, cancel, and
serialize resume metadata. The metadata includes only file identity, an opaque
server session ID, and completed part ETags; it never includes a `File`, signed
target, header, provider multipart ID, or object key. Applications may persist
this metadata and pass it to `queue.resume(...)` after the user reselects the
matching file. Single-PUT uploads finish before pause; multipart uploads pause
after the active part.

Single-PUT uploads are the default; configure the server's `multipart`
thresholds to enable server-issued multipart part targets. Cross-origin object
stores must expose the `ETag` response header.

## CMS client and server

The CMS client, shared contracts, server handlers, and framework adapters use
separate `@puzzle-ui/fullstack/cms/*` entry points. Keep browser clients and
serializable DTOs separate from the server-only CMS service and Storage
adapter. Resolve trusted tenant/actor context for every request before
constructing its CMS instance, and authorize each route separately. Never
accept tenant, actor, or authorization decisions from browser input. Admin
reads and mutations remain separate from public published reads. Server setup
requires the static CMS `config`, Storage adapter, explicit `accessPolicy`,
`scheduler`, `resolveContext(request)`, and route-level `authorize(access)`.
The code-defined collection configuration can opt into drafts and timestamps,
set `localization: { locales, defaultLocale }`, and provide access policies and
hooks.
Collection access is deny-by-default for omitted actions; both the global
`accessPolicy` and any collection action policy must allow a request. Hooks run
server-side: `beforeChange` can veto before persistence, while `afterChange`
runs after commit and cannot roll back a successful write.

```ts
import { createCmsClient } from "@puzzle-ui/fullstack/cms/client";

const cms = createCmsClient({ basePath: "/api/cms" });
const articles = await cms.collection("articles").find({
  where: { title: { contains: "launch" } },
  limit: 25,
  page: 1,
  locale: "en-US",
});
const siteSettings = await cms.singleton("settings").find();
```

Content types are code-defined and are not registered at runtime. Collection
keys and singleton keys come from the server's static CMS configuration.
Regular collections expose `find`, `findById`, `findBySlug`
when a slug field exists, `create`, `update`, `delete`, and `purge`; `.public`
exposes published reads. `delete` is a soft delete; purge permanently removes
after schedule checks and scans current entries, published snapshots, and
immutable revisions for incoming relationships. Relationship additions
conditionally advance a per-target guard in the same batch as their content
write; purge conditionally removes that guard with the target. Thus a
concurrent relationship write either commits first and makes purge conflict
or fails without leaving a dangling reference. A relationship-capable schema
alone does not block purge if there are no current or historical references.
Singleton clients expose `find`, `create`, `update`, `delete`, and `purge`,
with `.public.find` for public reads.

Queries accept `where`, `sort`, `limit`, `page`, `after`, and `locale`.
`create` accepts optional `slug`, `locale`, `translationGroupId`, and
`changeSummary`; `update(id, data, { expectedRevision, changeSummary?, slug? })`
and `delete(id, { expectedRevision, changeSummary? })` use optimistic
concurrency. Public reads use the separate `.public` client; callers do not
set a visibility flag.
Regular purge is `purge(id, { expectedRevision, changeSummary? })`; singleton
purge is `purge({ expectedRevision, locale?, changeSummary? })`. It removes
the entry, revisions, and its own media-usage records, preserving other
entries' shared media usages.

Collection clients expose `publish`/`unpublish`/`archive` with an
`expectedRevision`, `schedulePublish(id, { expectedRevision, publishAt,
timeZone, changeSummary? })`, `unschedule` with an `expectedRevision`,
`listRevisions(id, first?)`, and
`restoreRevision(id, { expectedRevision, revisionId, changeSummary? })`.
`drafts: true` enables publishing and revision/restore operations; a configured
scheduler enables scheduling and the `POST /scheduler/publications` worker
route. Its `publication` payload contains `entryId`, `scheduledRevisionNumber`,
`publishAt`, and `timeZone`; the server derives tenant context from the trusted
host resolver, not from the payload. The response distinguishes published
entries from stale or not-due jobs. A
`localization: { locales, defaultLocale }` option enables locale-aware reads,
`listLocaleVariants(id, queryWithoutLocale?)`, and
`createTranslation(id, data, { locale, slug?, changeSummary? })`.
Singleton clients expose `publish`, `unpublish`, `archive`, `schedulePublish`,
`unschedule`, `listRevisions`, `restoreRevision`, `listLocaleVariants`, and
`createTranslation` at the collection root, without a document ID. Singleton
translation creation takes `data` and `{ locale, changeSummary? }`.

`CmsApiDocument` is a flat JSON-safe record with a required `id`; collection
pages contain these documents, not nested `{ fields }` objects. Map the schema's
field keys into a `CmsEntryListItem.fields` projection before passing a page to
Pieces. Admin documents include status/revision metadata; timestamp fields are
present only when timestamps are enabled. Public documents contain published
fields but omit status, revision, timestamp, scheduling, archive, and delete
metadata. The client does not expose audit-query methods.

The Next.js and TanStack Start adapters dispatch the same `CmsServer` route
map. `createNextCmsHandler({ cms })` returns `GET`, `POST`, `PATCH`, and
`DELETE` handlers; `createTanStackCmsHandler({ cms })` returns a
`Request => Promise<Response>` dispatcher. Their `create*CmsRouteHandlers`
helpers expose the route map for explicit framework route registration.
Routes are derived from the static config: collection admin/public paths are
`/admin/collections/:key` and `/public/collections/:key`. Regular collections
add a `/:documentId` route; `/by-slug/:slug` routes exist only when the schema
defines a slug field. Draft-enabled collections add `publish`, `unpublish`,
`archive`, `restore`, and `revisions` routes under the document path; a
configured scheduler adds `schedule`/`unschedule`, while localization adds
`translations`. Singleton lifecycle routes use the collection root. The
scheduler worker resolves tenant context from the host, never from the request
body.

Webhook management routes are opt-in through `createCmsServer({ webhooks })`.
When enabled, provide a host transport, `resolveSecret`, and
`resolveSecretRef({ context, request, purpose, subscriptionId? })`; Fullstack
binds its Storage, access policy, clock, and ID generator to the webhook
service. Without `webhooks`, these routes are not mounted.

Routes are `GET/POST /admin/webhooks`,
`GET/PATCH /admin/webhooks/:subscriptionId`,
`GET /admin/webhooks/:subscriptionId/deliveries?first`,
`GET /admin/webhook-deliveries/:deliveryId/attempts?first`, and
`POST /admin/webhook-deliveries/:deliveryId/retry` with an
`expectedRevision`. The client exposes `listWebhookSubscriptions`,
`getWebhookSubscription`, `createWebhookSubscription`,
`updateWebhookSubscription`, `listWebhookDeliveries`,
`listWebhookAttempts`, and `retryWebhookDelivery`.

When `emitChangeEvents: true` or `webhooks` is configured, Fullstack also
mounts `GET /admin/change-events?first&after` and
`POST /admin/change-events/:eventId/ack` with `{ expectedRevision }`.
`listChangeEvents({ first?, after? })` returns a page of sanitized change-event
DTOs containing `id`, `resource`, `resourceId`, `action`, `occurredAt`,
`createdAt`, `updatedAt`, `revision`, and optional `revisionNumber`; tenant IDs
and fanout leases are omitted. The page has
`{ items, nextCursor, hasNextPage }`.
`acknowledgeChangeEvent(eventId, expectedRevision)` returns void and invalidates
change-event queries. Event routes can be enabled without webhook
administration by setting
`emitChangeEvents: true`.

Secret values, secret-manager references, and delivery lease tokens never
enter browser DTOs. The routes do not execute deliveries: the host schedules
the standalone `CmsWebhookService` fanout and delivery workers separately.
When `emitChangeEvents: true` is enabled on `createCmsServer` (or `webhooks`
is configured, which enables emission), CMS writes metadata-only events.
Fullstack does not expose its request-scoped CMS instance, but authorized
change-event routes and client methods are available as described above.
Supply listed event IDs and revisions to `fanout`; fanout records deliveries
and removes the event. Run `runNext` separately to deliver jobs. See the
[CMS package documentation](https://puzzle-ui.com/docs/cms) for worker,
signature, and transport security details.

## Entry points

- `@puzzle-ui/fullstack/cms/client` — browser CMS client and query invalidation.
- `@puzzle-ui/fullstack/cms/shared` — serializable CMS API contracts.
- `@puzzle-ui/fullstack/cms/server` — authorized CMS admin and public handlers.
- `@puzzle-ui/fullstack/cms/next` — Next.js CMS route-handler adapter.
- `@puzzle-ui/fullstack/cms/tanstack` — TanStack Start CMS adapter.
- `@puzzle-ui/fullstack/media/client` — browser client and bounded upload queue.
- `@puzzle-ui/fullstack/media/shared` — serializable media API contracts and sanitized views.
- `@puzzle-ui/fullstack/media/server` — authenticated handlers, route map, and server-only service adapters.
- `@puzzle-ui/fullstack/media/next` — Next.js route-handler adapter.
- `@puzzle-ui/fullstack/media/tanstack` — TanStack Start adapter.
- `@puzzle-ui/fullstack/auth/client` — browser client, React provider/hooks/components, auth experience, localization, and passkey helpers.
- `@puzzle-ui/fullstack/auth/server` — server handlers, route map, session and step-up helpers, lifecycle handlers, readiness checks.
- `@puzzle-ui/fullstack/auth/shared` — serializable public auth contracts (types only).
- `@puzzle-ui/fullstack/auth/next` — Next.js route-handler adapter.
- `@puzzle-ui/fullstack/auth/tanstack` — TanStack Start adapter.

There is no root package export; import a documented subpath. See the [full documentation](https://puzzle-ui.com/docs/fullstack) for API details and production guidance.
