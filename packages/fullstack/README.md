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

The existing npm release contains the Auth subpaths. The new `/media/*` and
`/cms/*` subpaths are available in this repository as workspace source and
require a coordinated release with `@puzzle-ui/media` and `@puzzle-ui/cms`
before they can be installed from npm.

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

The CMS client exposes content type, entry, revision, relationship, audit,
publishing, and published-read methods. Mutations use revision conditions and
explicit query invalidation:

```ts
import { createCmsClient } from "@puzzle-ui/fullstack/cms/client";

const cmsClient = createCmsClient({
  basePath: "/api/cms",
  onInvalidate: (keys) => queryCache.invalidate(keys),
});

const page = await cmsClient.listEntries({
  contentType: "article",
  locale: "en-US",
  first: 25,
});
```

Configure the server with a Storage adapter, explicit scheduler, tenant/actor
resolver, CMS access policy, and route authorization. Admin mutations and
private reads are separate from public published-entry routes; public
responses project only the published snapshot. CMS API responses use
`no-store`. Scheduled jobs require the host scheduler to call
`publishScheduled` with the revision-bound job; a timestamp alone never
publishes content.

Webhook administration is opt-in through the CMS server's `webhooks` option.
Provide a transport that enforces connection-time SSRF protections, a
server-side secret resolver, and a side-effect-free `resolveSecretRef` that
selects a pre-provisioned tenant secret reference for creation or rotation.
Clients cannot provide or read secret references. Configure policies for
`webhook:read`, `webhook:manage`, `webhook:dispatch`, `change-event:read`, and
`change-event:ack`; schedule outbox fanout and delivery workers separately
using `CmsWebhookService` with the same storage. A failed or stale update may
occur after reference selection, so provisioning and cleanup remain host
responsibilities. See the CMS package documentation for delivery and transport
requirements.

Use `@puzzle-ui/fullstack/cms/next` for Next.js route handlers or
`@puzzle-ui/fullstack/cms/tanstack` for a TanStack Start dispatcher. The
framework adapters reuse the same CMS route map.

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
