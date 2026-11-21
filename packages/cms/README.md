# `@puzzle-ui/cms`

Framework-neutral content schema, validation, querying, revision, and publishing
services for applications that provide an `@puzzle-ui/storage` adapter.
The package does not provide a database, router, React UI, authentication
system, scheduler, or media provider.

## Availability and local workspace use

`@puzzle-ui/cms` is not published to npm yet. External npm installation must
wait until a release; do not use `npm install` or `bun add` for this package
before then.

To try it inside this repository, add `"@puzzle-ui/cms": "workspace:*"` to
the consuming workspace's dependencies and run Bun from the repository root.
The package is discovered by the existing `packages/*` workspace pattern.
No workspace-pattern change is needed; this package task does not modify root
manifests or lockfiles.

```json
{
  "dependencies": {
    "@puzzle-ui/cms": "workspace:*"
  }
}
```

## Configure the service

Access policy is required and denies every action the host application does not
explicitly allow. Tenant and actor context are supplied to every call.

```ts
import { CmsService } from "@puzzle-ui/cms";
import type { StorageAdapter } from "@puzzle-ui/storage";

const storage: StorageAdapter = getStorageAdapter();
const cms = new CmsService({
  storage,
  accessPolicy: async ({ tenantId, actor, action }) =>
    actor !== null && await canEditTenant(actor, tenantId, action),
});

const contentType = await cms.registerContentType({
  tenantId: "tenant_1",
  actor: { id: "user_1" },
  definition: {
    slug: "article",
    name: "Article",
    version: 1,
    locales: ["en-US", "fr-FR"],
    defaultLocale: "en-US",
    fields: [
      { key: "title", type: "text", label: "Title", required: true, localized: true },
      { key: "path", type: "slug", label: "Slug", required: true, localized: true },
    ],
  },
});

const draft = await cms.createEntry({
  tenantId: "tenant_1",
  actor: { id: "user_1" },
  contentType: "article",
  locale: "en-US",
  fields: { title: "An example", path: "an-example" },
});

await cms.publish({
  tenantId: "tenant_1",
  actor: { id: "user_1" },
  entryId: draft.id,
  expectedRevision: draft.revision,
});
```

Use the `revision` returned from a read or mutation as `expectedRevision` for
every update or lifecycle transition. Conflicts are reported rather than
overwritten. Schema `version` is separate from the storage record revision.
`saveDraft` replaces the complete field object; it is not a partial patch.

## Supported domain behavior

- Field types: text, textarea, rich text, number, boolean, date/datetime, slug,
  select/multi-select, media asset ID, relationship, repeater, blocks, JSON,
  and locale.
- Required/default/min/max/pattern/allowed-value constraints, named custom
  validators, nested validation, field localization, and explicit schema
  compatibility checks.
- Tenant-scoped content types and entries; canonical BCP 47 locales, explicit
  fallback order, locale-specific slugs, relationship checks, and cursor pages.
- `findEntry` applies fallbacks only when the caller provides them, looking for
  the same normalized slug in each listed locale. It never picks an arbitrary
  or default locale.
- Search and arbitrary field filters operate on the tenant/type-scoped records
  returned by Storage and are evaluated in memory. Configure database-level
  query/index strategies in the host application for large collections.
  Cursor pagination also sorts and filters this scoped result set in memory.
- Immutable revision snapshots, draft/save, publish/unpublish, schedule/
  unschedule, archive, soft delete, and restore-as-a-new-revision.
- Audit events are persisted with successful mutations; denied policy checks
  are also recorded. Field access can be restricted by policy callbacks.
- An opt-in change-event outbox records metadata about successful content
  mutations in the same atomic batch as the mutation.
- Tenant-scoped media usage records track draft and published field references;
  `listMediaUsages` supports safe asset cleanup checks.
- Public reads return only the published snapshot. A scheduled update retains
  an existing published snapshot until the scheduled revision is published.
- Entry read and list calls require an explicit `visibility: "public"` or
  `visibility: "admin"` choice; access policy still authorizes each operation
  and can redact individual fields.

## Storage requirements

`CmsService` registers its collections through the public
`@puzzle-ui/storage` contract. Mutations require the adapter to report
`atomicBatch` and `uniqueConstraints`; content type and entry updates
additionally require `conditionalWrites`. Unsupported capabilities produce an
error instead of a weaker write. Schema registration requires atomic batches
and unique constraints.

## Change-event outbox

Set `emitChangeEvents: true` on every `CmsService` instance that writes the
same CMS database to persist a metadata-only event atomically with each
successful content-type or entry mutation. Events contain the tenant,
resource and action, resource ID, time, and (for entries) revision number;
they do not contain draft fields or secrets. Denied and no-op operations do
not produce change events. If the event insert fails, the mutation fails too.
Enabling the outbox additionally requires conditional writes and cursor
pagination.

An authorized server-side worker can call `listChangeEvents({ tenantId, actor,
first, after })`, process the returned `items`, and call
`acknowledgeChangeEvent({ tenantId, actor, eventId, expectedRevision })` only
after it has durably handled the event. The access policy must allow
`change-event:read` and `change-event:ack` for that worker. Both operations are
tenant-scoped; each returned event also undergoes a record-level read check.
Follow `nextCursor` whenever `hasNextPage` is true even if a page contains no
visible items. Repeat scans from the beginning: event IDs are not ordered by
commit time, so new events may appear before a previously returned cursor.

Acknowledgement permanently removes the pending event. Multiple workers can
observe the same event, and a worker can crash after handling but before
acknowledging it. The host must coordinate workers and make handling
idempotent; the outbox does not itself provide exactly-once processing.
Continue draining outstanding events even if event emission is later disabled.
Use one coordinated consumer for each outbox event: webhook fanout
acknowledges the event after recording its deliveries, so an independent
consumer must not acknowledge it first.

## Webhook delivery

`CmsWebhookService` uses the same storage adapter as `CmsService` to maintain
tenant-scoped subscriptions, delivery jobs, and attempt history. It requires
atomic batches, conditional writes, and unique constraints. Configure a
server-side `CmsWebhookTransport` and a secret resolver; there is deliberately
no default HTTP transport. Subscription records contain a secret-manager
reference, not the secret. Never expose the reference to untrusted clients or
use a secret value as the reference.

```ts
import { CmsWebhookService } from "@puzzle-ui/cms";

const webhooks = new CmsWebhookService({
  storage,
  accessPolicy,
  transport: safeWebhookTransport,
  resolveSecret: ({ tenantId, secretRef }) =>
    secretManager.readBytes(tenantId, secretRef),
});

const subscription = await webhooks.createSubscription({
  tenantId: "tenant_1",
  actor: { id: "operator_1" },
  endpoint: "https://hooks.example.com/content",
  events: ["entry:publish", "entry:unpublish"],
  enabled: true,
  secretRef: "webhooks/content/current",
});
```

Authorize `webhook:read`, `webhook:manage`, and `webhook:dispatch` explicitly
in the host policy. The worker also needs `change-event:read` and
`change-event:ack`. Periodically scan every page of the CMS outbox, call
`fanout` with each event's ID and revision, and call `runNext` until it returns
`null`. Schedule the worker to run again for delayed retries and expired
leases; nothing runs automatically. Fanout uses subscriptions enabled when it
scans them and records one job per matching subscription before acknowledging
the event. A failed scan can already have recorded some jobs; retries are
idempotent. Subscription changes concurrent with fanout take effect according
to the scans that run, not the original mutation time.

Delivery is at least once, not exactly once. Workers use optimistic leases;
expired attempts are recorded and may be sent again. A transport timeout,
connection or secret-resolution error, invalid transport response, 408, 429,
or 5xx is retried with bounded exponential delay; other non-2xx responses
fail. `listDeliveries` and `listAttempts` expose
authorized history; `retryDelivery` explicitly retries a failed job.
Disabling a subscription cancels jobs when workers observe that it is
disabled. Jobs already claimed by a worker may still be sent. Use synchronized
clocks across workers and CMS instances.

Rotate secrets by updating the subscription's `secretRef` with
`updateSubscription` and its expected revision. Pending jobs use the current
subscription endpoint and secret at send time. Keep the previous receiver
secret during the overlap, then remove it after the host's retry horizon.
The host owns secret storage, delivery-history retention, and reconciliation.

## Webhook signatures

`signCmsWebhook` and `verifyCmsWebhook` provide a signing and verification
primitive for hosts implementing their own webhook transport. They require
Web Crypto, a cryptographically random secret of at least 32 bytes, a stable
ASCII delivery ID, and the exact raw request body as bytes. The signature
header is `t=<Unix milliseconds>,v1=<lowercase HMAC-SHA256 hex>`; the signed
bytes are UTF-8 `v1.<timestamp>.<deliveryId>.` followed by the raw body.
Transmit the delivery ID separately and keep the secret server-side.

Verification accepts one to three active secrets to support a controlled
rotation overlap. It rejects malformed signatures, timestamps outside the
configured window (five minutes by default, at most 24 hours), changed bodies,
and replayed delivery IDs. Pass a trusted, stable endpoint-specific `scope`
and a durable `CmsWebhookReplayStore` that atomically records the
`(scope, deliveryId)` pair until `expiresAt`; for duplicates the store must
extend its expiry when the new expiry is later. The scope and delivery ID
must each use 1–128 ASCII letters, numbers, underscores, or hyphens. The
primitive accepts bodies up to 1 MiB.

Replay reservation is not a substitute for application-level idempotency.
Commit a durable processing handoff together with the replay reservation, or
enclose verification and the durable application mutation in one transaction:
otherwise a crash after verification can cause a legitimate retry to be
rejected before its work was saved. Retain application idempotency records for
the delivery retry horizon. Replay-store failures propagate and must not be
treated as successful verification.

These primitives do not send requests or protect outbound connections from
SSRF. A host-provided transport must enforce safe HTTPS destination,
connection-time DNS/IP validation, redirect, timeout, and response-size
policies; syntax checks alone are not sufficient.

Relationship fields contain entry IDs and are checked against tenant, target
type, locale, and configured status rules. Media fields contain asset ID
strings. To use them, pass `mediaReferenceValidator.assertCanReference`; without
that callback, media asset values are rejected. CMS records draft and published
usages in its own Storage collections and exposes them through
`listMediaUsages`, guarded by the `media:usage-read` policy action. The CMS
package does not import or assume a media runtime API.

## Scheduling and migrations

Scheduling requires an injected `CmsScheduler` with `schedule` and `cancel`
methods. Retain the job passed to `CmsScheduler.schedule` and call
`publishScheduled` with that exact job when it becomes due. Supply `publishAt`
as an absolute `Date` and an
explicit IANA `timeZone` for editorial display; the CMS does not infer a local
timezone or convert wall-clock strings. Jobs are revision-bound and stale jobs
are no-ops.
Scheduler operations are external to the database transaction; errors are
surfaced, and stale jobs cannot publish content after a conflicting edit.

Breaking schema changes require a consecutive version increment and a
`CmsSchemaMigration`. Register all required migration callbacks in
`CmsServiceOptions.migrations` after process restart. Compatible additions
(optional or defaulted fields) can pass through without a migration. Migration
callbacks transform old field objects; restored and newly saved values are
validated against the current schema.

## Development

```sh
bun run typecheck
bun run test
bun run build
```

See `AGENTS.md` and `ai/instructions.md` for package boundaries and security
requirements.
