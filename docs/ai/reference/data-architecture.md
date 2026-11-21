# Data architecture

Choose where data belongs before choosing a database. Keep content ownership,
business rules, persistence, and presentation explicit.

## Classify the data

| Data kind | Typical treatment |
| --- | --- |
| Static editorial content | Version with the site or content system; use a database only for a real editing or publishing need. |
| Configuration | Keep in typed code or deployment configuration; do not make a database the default for constants. |
| User-generated content | Validate at the server boundary, define ownership and retention, then persist if it must survive requests/devices. |
| Dynamic application data | Model domain entities and lifecycle first; persist when durable, shared, queryable, or transactional behavior is required. |
| External-service data | Identify the upstream source, freshness/cache policy, attribution, failure behavior, and whether a local copy is needed. |
| Sensitive data | Minimize collection and retention. Keep credentials, tokens, and server-only personal data out of client bundles, logs, fixtures, and public content. |

## Decide whether persistence is needed

A database is usually justified by durable user data, concurrent users,
cross-device state, server-side querying, or atomic multi-record changes. Static
content, build-time data, and values derivable from trusted configuration do
not need persistence just because an adapter is available.

Define domain types, validation, ownership, authorization, and lifecycle before
choosing a storage engine. Keep presentation components independent of those
decisions. Use shared schemas at request and service boundaries where the
application architecture supports it.

## Choose and use storage

Start with the framework-neutral
[`@puzzle-ui/storage` contract](../../../packages/storage/AGENTS.md), then inspect
the selected adapter's package guide and manifest. Choose based on verified
capabilities and deployment constraints, not the database brand. Do not invent
adapter methods or assume unique constraints, atomic batches, TTL, transactions,
or migration behavior; check the adapter's contract and reported capabilities.

Keep database access server-side. Separate domain services from framework
request handlers and from UI. Use deterministic seed fixtures for development
and tests; make reset scope explicit, refuse production/remote targets, and
never seed real user data or production credentials.

For content-managed applications, use [`@puzzle-ui/cms`](../../../packages/cms/README.md)
for content schemas, entries, revisions, and publishing lifecycle. It persists
content metadata through `@puzzle-ui/storage`; the host application supplies
the access policy and any scheduler.

For media, persist metadata through Storage but send binary bytes through the
separate [`@puzzle-ui/media` object-storage contract](../../../packages/media/README.md).
Do not store file bytes in `StorageAdapter` records. CMS media fields contain
asset IDs; tenant checks, authorization, signed reads, and upload validation
remain server responsibilities.

## Content, facts, and secrets

- Model content according to its owner and update lifecycle; use static
  content for stable editorial pages and structured records for dynamic,
  queried data.
- Do not fabricate factual copy, testimonials, ratings, statistics, customer
  names, or structured-data claims. Use clearly marked placeholders until
  verified content is provided.
- Put secret values in local environment files or a secret manager, keep
  example files limited to variable names and safe placeholders, and exclude
  local secret files from version control.
- Read secrets only in server-only code. Never expose them through public
  environment prefixes, client components, generated examples, or logs.

For a concrete framework-neutral example, see the
[Workspace architecture](../../../docs/workspace/architecture.md) and
[database-integration workflow](../workflows/database-integration.md).
