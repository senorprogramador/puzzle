# `@puzzle-ui/cms` — Agent Instructions

## Responsibility and boundaries

CMS owns framework-neutral content schemas, validation, entry/query services,
revision-safe editorial lifecycle, access-policy hooks, and audit records. It
does not own React, HTTP routes, user/role management, a database driver, file
bytes, or media runtime behavior.

Use the public `@puzzle-ui/storage` exports for metadata persistence. Storage
conditional writes, unique constraints, and atomic batches must be explicitly
reported by the adapter before operations that depend on them are allowed.
Media values are asset ID strings; a caller-provided validator must authorize
the reference. CMS stores tenant-scoped draft and published media usage records
atomically with entry revisions. Do not import undocumented media runtime APIs.

## Public API and security

- The package root is the only public entry point.
- Content schemas are code-first. Build static keyed collections and
  singletons with the public `collection`, `collection.singleton`, and `fields`
  factories inside `defineCMS`; do not register or mutate content types at
  runtime. Collection configuration includes opt-in drafts and timestamps,
  nested localization settings, local access policies, and lifecycle hooks.
- `createCms` binds one static configuration and Storage adapter to a
  configured instance. When trusted `CmsRequestContext` is supplied,
  `accessPolicy` is required. Without context, the local default permits only
  tenant `"default"` with actor `null`; it is not a permissive multi-tenant
  policy. Resolve tenant and actor at the server boundary; actor may explicitly
  be `null`. Instance methods do not accept caller-supplied tenant or actor IDs.
- A supplied global `accessPolicy` has no permissive default. A collection
  `access` map is deny-by-default for omitted actions; both global and
  collection policies must allow an operation. Policies receive trusted
  context and the resource/action being authorized.
- Collection access aliases cover `read`, `create`, `update`, `delete`,
  `publish`, `unpublish`, `schedule`, `unschedule`, `archive`, `restore`,
  `revisions`, and `translations`. Callbacks receive `user` as the trusted
  `actor` and the selected alias as `action`. `field:read` maps to `read`;
  field writes map to `create`, `update`, or `restore`.
- Every storage query is tenant-scoped. Never treat an entry or asset ID as
  authorization.
- Public entry reads project only the immutable published snapshot. Draft
  fields are not returned by public reads.
- Drafts, publication, revisions, localization, and scheduling are opt-in
  collection lifecycle behavior. Published snapshots remain separate from
  drafts; revisions are immutable and writes retain optimistic concurrency.
  Scheduled publication requires an explicit `CmsScheduler`; a timestamp alone
  never publishes content, and jobs carry an expected revision.
- `beforeChange` runs after access authorization and before validation and
  persistence; it may veto the write. `afterChange` runs after commit and
  receives the committed entry; an `afterChange` error is surfaced without
  rolling back the mutation. Do not pass access policies or hooks to client
  components.
- Revisions are immutable records written atomically with entry mutations and
  audit events. Do not weaken optimistic concurrency or hide unsupported
  storage capabilities.
- `delete` is a soft delete. Permanent `purge` requires an expected revision,
  cancels scheduled publication, and atomically removes the entry, its
  revisions, its own media usages, and its relationship guard. Scan current
  entries, published snapshots, and immutable revisions for incoming refs.
  Every new relationship ref must conditionally advance its target guard in
  the same batch as the source write; purge must conditionally delete that
  guard with the target so concurrent writes cannot leave dangling refs.
  Fail closed on bounded-scan or capability errors, and preserve other
  entries' shared media usages.
- When `emitChangeEvents` is enabled, successful content mutations also write
  metadata-only outbox events atomically. Workers must be tenant-authorized,
  idempotent, and acknowledge only after durable processing.
- When enabled, `cms.events.list({ first, after })` reads the outbox and
  `cms.events.acknowledge(eventId, { expectedRevision })` acknowledges a
  durable event. Context and access policy are bound to the instance. Webhook
  fanout may acknowledge an event after recording its deliveries; coordinate
  one outbox consumer and do not acknowledge the same event twice.
- Webhook delivery requires a host transport with connection-time SSRF
  protections and a server-side secret resolver. Do not add a default fetch
  transport or expose secret references through client-facing APIs.
- Custom validators and schema migrations are runtime callbacks; store only
  serializable definitions and require callbacks again after process restart.

## Development

Keep values serializable, validate nested/repeater/block fields recursively,
and keep locale fallback explicit. Slugs are unique by tenant, content type,
and locale; published slugs remain reserved until unpublish/archive. Changes
that remove fields, alter types, localization, constraints, or add required
fields need an explicit version migration.

Run `bun run typecheck`, `bun run test`, and `bun run build` in this package.
Update `README.md` and `ai/instructions.md` whenever public behavior changes.
