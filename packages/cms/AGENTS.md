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
- `CmsService` requires an explicit `accessPolicy`; there is no permissive
  default. Every request provides tenant and actor context, where actor may
  explicitly be `null`.
- Every storage query is tenant-scoped. Never treat an entry or asset ID as
  authorization.
- Public entry reads project only the immutable published snapshot. Draft
  fields are not returned by public reads.
- Scheduled publication requires an explicit `CmsScheduler`. A scheduled
  timestamp alone never publishes content. Scheduler jobs carry an expected
  revision so stale jobs cannot publish updated or cancelled entries.
- Revisions are immutable records written atomically with entry mutations and
  audit events. Do not weaken optimistic concurrency or hide unsupported
  storage capabilities.
- When `emitChangeEvents` is enabled, successful content mutations also write
  metadata-only outbox events atomically. Workers must be tenant-authorized,
  idempotent, and acknowledge only after durable processing.
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
