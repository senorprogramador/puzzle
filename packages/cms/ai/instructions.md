# `@puzzle-ui/cms` consumer guidance

`@puzzle-ui/cms@0.18.0` is published to npm, but the current code-first rewrite
documented here is not yet released; do not assume the published tarball
contains these APIs. In this repository, consume the code-first implementation
through a Bun workspace dependency (`"@puzzle-ui/cms": "workspace:*"`).

Use the package root only. `defineCMS`, `collection`/`collection.singleton`,
and `fields.*` define the static schema in application code. Content types are
not registered or mutated at runtime. Collection keys are stable service API
keys; use a versioned migration for breaking schema changes.

## Server usage and trust boundaries

- Construct a request-scoped instance with `createCms` after the host resolves
  tenant and actor from a trusted server request/session.
- When a request context is supplied, pass an explicit `accessPolicy`. Without
  context, the local default is limited to tenant `"default"` and actor `null`;
  it is not a permissive multi-tenant policy.
- Instance methods use their bound tenant/actor; never pass caller-supplied
  identity IDs or treat a document/asset ID as authorization.
- Public reads return only the published snapshot. Admin reads and mutations
  require policy authorization and must not expose draft fields publicly.
- Collection `access` maps are deny-by-default for omitted actions. The global
  access policy and collection policy are ANDed. Access callbacks, lifecycle
  hooks, validators, migrations, secrets, and service instances are
  server-only; never pass raw server config to a browser Piece.

## Schema and lifecycle

- `drafts` and `timestamps` are opt-in and default off.
- Localization is configured as
  `localization: { locales, defaultLocale? }`. Locale fallback is explicit;
  never select an arbitrary/default locale.
- Field factories infer values; required fields without defaults are required
  on create, while updates are partial. Factories cover text, textarea, number,
  boolean, date, datetime, email, URL, slug, select, multi-select, media,
  relationship, rich text, JSON, arrays, objects, blocks, computed, and custom
  values.
- Relationships target static collection keys and are checked at compile time
  and at runtime for tenant, locale, and configured status rules.
- Use `expectedRevision` for writes and lifecycle transitions. Conflicts need
  a fresh read and an explicit merge/retry decision. Revisions are immutable;
  restoration creates a new revision.
- `delete` is a soft delete. Use explicit `purge` only for permanent removal;
  it requires the current revision, scans current entries, published
  snapshots, and immutable revisions for incoming refs, and cancels scheduled
  publication. Relationship additions conditionally advance a per-target
  guard in the same batch as the source write. Purge conditionally deletes
  that guard with the target, preventing concurrent writes from creating
  dangling refs. A relationship-capable schema alone does not block purge
  when no current or historical references exist; bounded-scan and capability
  failures fail closed.
- Scheduled publication requires a configured `CmsScheduler`; a timestamp
  alone never publishes. Jobs are bound to an expected revision and timezone.
- `beforeChange` runs after access authorization and before validation/persist;
  throwing vetoes the mutation. `afterChange` runs after commit; its error is
  surfaced without rolling back a successful write.

## Media and webhooks

Media fields store asset-ID strings, never object keys or signed URLs. Supply a
tenant-aware media-reference validator before accepting a value. Store file
bytes through Media object storage and check CMS media usage before permanent
asset deletion.

`CmsWebhookService` is a separate host-side service, not part of the
request-scoped collection facade. Provide its Storage adapter, explicit access
policy, SSRF-safe transport, and server-side secret resolver; there is no
default network transport. Do not expose secret references in client DTOs.
`createCms({ emitChangeEvents: true })` exposes tenant-bound
`cms.events.list({ first?, after? })` and
`cms.events.acknowledge(eventId, { expectedRevision })` methods under its
service access policy. Feed webhook fanout from the listed event ID/revision;
fanout records deliveries and removes the event itself. Other consumers must
acknowledge only after durable processing. Keep workers authorized and
idempotent.

See the [CMS package documentation](https://puzzle-ui.com/docs/cms) for schema,
CRUD/querying, lifecycle, localization, media, and webhook details, and the
[Fullstack CMS guide](https://puzzle-ui.com/docs/fullstack/cms) for HTTP and
framework adapters.
