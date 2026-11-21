# `@puzzle-ui/cms` consumer guidance

`@puzzle-ui/cms` is not published to npm yet. In this repository, consume it
through a Bun workspace dependency (`"@puzzle-ui/cms": "workspace:*"`).
External npm installation must wait for a release; do not imply that
`npm install` or `bun add` is available now.

Use `@puzzle-ui/cms` for framework-neutral content types, entries, revisions,
locale variants, and publishing lifecycle. It is not a CMS admin UI or HTTP API.

- Provide a real `StorageAdapter`, a deny-by-default `accessPolicy`, and
  tenant/actor context for every call.
- Use server-side adapters and policy checks for all mutation routes. A client
  session or an entry/asset ID is not authorization.
- Pass `CmsScheduler` explicitly before using scheduled publication. Provide
  an absolute `publishAt` plus explicit IANA `timeZone`; invoke
  `publishScheduled` only for due jobs, and forward its exact task/revision.
- Use media asset IDs as strings and inject a tenant-aware
  `CmsMediaReferenceValidator`; CMS does not require or depend on media runtime
  exports. Its own storage records track draft/published references; check
  `listMediaUsages` before allowing cleanup.
- Supply named custom validators and version migration callbacks on each
  process start. Breaking schema changes without a migration are rejected.
- Use `expectedRevision` on every entry mutation. Conflicts require a fresh
  read and an explicit retry/merge decision.
- Public read methods expose only `publishedSnapshot`; use admin reads only
  behind server-side access policy.
- `emitChangeEvents` enables a metadata-only, transactionally persisted
  outbox. Authorize `change-event:read` and `change-event:ack` for trusted
  workers, scan every cursor page and restart scans, and acknowledge only
  after durable, idempotent handling. Webhook fanout is one outbox consumer,
  so do not separately acknowledge its events.
- `signCmsWebhook` and `verifyCmsWebhook` sign exact raw bytes with HMAC-SHA256.
  Verification requires a durable atomic replay store and supports up to three
  secrets during rotation. Couple replay reservation to durable processing;
  hosts remain responsible for safe outbound networking.
- `CmsWebhookService` persists subscriptions, leased deliveries, retries and
  attempt history. Provide a host transport that validates DNS and addresses
  at connection time, pins the connection, rejects redirects, and enforces
  timeouts and response limits; no default transport is provided. Supply
  secrets via a server-side resolver, never expose secret references to
  clients, and schedule periodic outbox fanout and delivery workers.

Search and field filtering are currently in-memory over tenant/type-scoped
records because `@puzzle-ui/storage` has no full-text or dynamic nested-field
query contract. Avoid unbounded public list operations on large collections;
add a host-level search strategy where necessary.
