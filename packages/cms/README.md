# `@puzzle-ui/cms`

Framework-neutral, code-first content schemas, validation, querying, editorial
lifecycle, access policies, and media-reference tracking for applications that
provide an `@puzzle-ui/storage` adapter. CMS does not provide a database,
identity provider, HTTP router, React admin UI, scheduler implementation, or
media object storage.

## Availability

`@puzzle-ui/cms@0.18.0` is published to npm. The current code-first API
documented here is a newer rewrite and is not yet released; do not assume the
npm tarball contains these APIs. In this repository, use
`"@puzzle-ui/cms": "workspace:*"` and install from the repository root to
consume the code-first implementation.

The package root is its only public entry point. Use the public
`@puzzle-ui/storage` contract for metadata persistence and the documented
`@puzzle-ui/media` contracts for assets. Do not deep-import source files.

## Define the schema in code

`defineCMS` accepts a static, keyed collection registry. Collection keys are
the stable service API keys; singleton collections use a stable root document
instead of a list. A schema is not registered or changed at runtime.

```ts
import { collection, defineCMS, fields } from "@puzzle-ui/cms";

const config = defineCMS({
  collections: {
    articles: collection({
      name: "Article",
      description: "Editorial articles.",
      version: 1,
      drafts: true,
      timestamps: true,
      localization: {
        locales: ["en-US", "fr-FR"],
        defaultLocale: "en-US",
      },
      fields: {
        title: fields.text({ label: "Title", required: true, localized: true }),
        slug: fields.slug({ label: "Slug", from: "title", required: true, localized: true }),
        summary: fields.textarea({ label: "Summary", localized: true }),
        featured: fields.boolean({ label: "Featured", defaultValue: false }),
        related: fields.relationship({
          label: "Related articles",
          target: "articles",
          multiple: true,
          sameLocale: true,
          allowedStatuses: ["published"],
        }),
      },
    }),
    settings: collection.singleton({
      name: "Site settings",
      fields: {
        siteName: fields.text({ label: "Site name", required: true }),
      },
    }),
  },
});
```

`drafts` and `timestamps` are opt-in and default off. `localization` contains
the supported locale list and optional default locale; there are no implicit
locale fallbacks. Collection options also accept server-only `access` policies
and `beforeChange`/`afterChange` hooks; never serialize those callbacks to a
browser. See [Collections and fields](https://puzzle-ui.com/docs/cms/schema)
for the field catalog, configuration options, access, hooks, and migrations.

### Field factories

The public `fields` factory catalog includes:

- Scalars: `text`, `textarea`, `number`, `boolean`, `date`, `datetime`,
  `email`, and `url`.
- Identifiers and choices: `slug`, `select`, and `multiSelect`.
- Content and references: `media`, `relationship`, `richText`, and `json`.
- Structured values: `array`, `object`, and `blocks`.
- Server-derived values: `computed` and `custom`.

Field factories infer value types. Required fields without defaults are
required in create input; updates are partial. Factories support field labels,
required/default values, localization, validation metadata, and the
type-specific options documented on [Fields](https://puzzle-ui.com/docs/cms/schema#field-factories).
`toCmsFieldDefinition` converts a descriptor into its serializable schema
definition. Custom validation, access, and computed callbacks are runtime
server callbacks: do not persist or send them to client code.

For authoring UIs, use `toCmsPresentation(config)` to derive a serializable
`CmsCollectionPresentation`. It removes collection access/hooks and nested
field access/validation/computed callbacks; do not pass the raw server config
to a browser Piece.

## Create a request-scoped CMS instance

Resolve tenant and actor from a trusted server session, then bind that context
to one `createCms` instance. Collection methods never take caller-supplied
tenant or actor IDs.

```ts
import { createCms } from "@puzzle-ui/cms";
import type {
  CmsAccessPolicy,
  CmsRequestContext,
  CreateCmsOptions,
} from "@puzzle-ui/cms";
import type { StorageAdapter } from "@puzzle-ui/storage";

const allowSignedIn: CmsAccessPolicy = ({ actor }) => actor !== null;

export const createRequestCms = (
  storage: StorageAdapter,
  context: CmsRequestContext,
  mediaReferenceValidator: NonNullable<
    CreateCmsOptions["mediaReferenceValidator"]
  >,
) =>
  createCms({
    config,
    storage,
    context,
    accessPolicy: allowSignedIn,
    mediaReferenceValidator,
  });
```

When trusted `context` is supplied, `accessPolicy` is required. With no context,
the local single-tenant default permits only tenant `"default"` with actor
`null`; this is not a permissive multi-tenant policy. Production policies must
check tenant membership, roles, and the requested action.

Other `createCms` options include an explicit `CmsScheduler`, named custom
validators, schema migrations, a clock, an ID generator, and opt-in
`emitChangeEvents`. The scheduler and media-reference validator are needed
only for operations that use them. Change events are metadata-only and written
atomically. When enabled, the instance also exposes
`cms.events.list({ first?, after? })` and
`cms.events.acknowledge(eventId, { expectedRevision })`; both use its bound
tenant/actor and access policy. This is a server-side worker API; do not send
raw event records to browser clients.

## Collections, queries, and singletons

The configured instance is keyed by the schema; for the `articles` and
`settings` keys above, the services are `cms.articles` and `cms.settings`.
Document values are flattened schema fields plus CMS metadata; they are not
stored in a nested `fields` object.

```ts
const page = await cms.articles.find({
  where: { featured: { equals: true } },
  sort: "-updatedAt",
  limit: 20,
  page: 1,
  locale: "en-US",
  visibility: "admin",
});

const article = await cms.articles.findBySlug("first-article", {
  locale: "en-US",
  fallbackLocales: ["fr-FR"],
  visibility: "public",
});

const created = await cms.articles.create({
  title: "First article",
  summary: "A short introduction.",
  featured: false,
});

const updated = await cms.articles.update(
  created.id,
  { title: "Updated article" },
  { expectedRevision: created.revision, changeSummary: "Edited the title." },
);
```

`find` applies `where`, sort, locale, and page bounds through Storage. Conditions
include `equals`, `notEquals`, `contains`, `in`, `notIn`, ordered comparisons,
and `exists`; nested `and`/`or` groups are supported. Query paths are checked
against the configured schema. `findBySlug` requires a slug field; localized
fallback locales are explicit and tried in caller-provided order. Public
visibility returns only the published snapshot. Admin reads still require
policy authorization.

Collection services also expose `findById`, `delete` (soft delete), and
`archive`. `purge(id, { expectedRevision, changeSummary? })` is a separate
permanent-removal operation; it requires the current revision, scans current
entries, published snapshots, and immutable revisions for incoming
relationships, cancels scheduled publication, and atomically removes the
entry, its revisions, and its own media-usage records. Relationship additions
conditionally advance a per-target guard in the same batch as their content
write. Purge conditionally removes that guard with the target, so a concurrent
relationship write either commits first and makes purge conflict or loses and
fails without creating a dangling reference. If no current or historical
references exist, a relationship-capable schema alone does not block purge.
Bounded-scan or storage-capability failures still fail closed.
Other entries' shared media usages are preserved. `delete` and other
conditional mutations should use the current `expectedRevision`; conflicts
must be handled as a fresh-read/merge decision.
A slug generated from a field may be omitted from create input; otherwise
required fields are enforced from the schema.

Singletons use the same schema and lifecycle rules but expose a stable document
instead of a list. `cms.settings.find()` reads the singleton, while `create`,
`update`, `delete`, and `archive` operate on that stable root without an entry
ID. Singleton options include locale where localization is enabled.
`purge({ expectedRevision, locale?, changeSummary? })` permanently removes
the selected singleton locale variant.

See [Entries, queries, and relationships](https://puzzle-ui.com/docs/cms/entries)
for typed filters, cursor/page behavior, and relationship validation.

## Access and lifecycle

A global `CmsAccessPolicy` receives trusted tenant/actor context, resource, and
action and returns a boolean or promise of a boolean. Collection `access` is a
partial action-to-policy map; omitted local actions deny. Both the global and
collection policy must allow an operation. Action aliases include `read`,
`create`, `update`, `delete`, `publish`, `unpublish`, `schedule`, `unschedule`,
`archive`, `restore`, `revisions`, and `translations`. Field reads map to
`read`; field writes map to `create`, `update`, or `restore`.

Collection hooks are server-side:

- `beforeChange(event)` runs after authorization and before validation and
  persistence; throwing vetoes the mutation.
- `afterChange({ ...event, entry })` runs after commit. Its errors are
  surfaced, but do not roll back a successful mutation.

With `drafts: true`, collections support draft saves, publish/unpublish,
revision listing, and restore-as-a-new-revision. Revisions are immutable;
mutations use optimistic `expectedRevision` conditions. Public reads never
return draft fields. A configured `CmsScheduler` enables `schedulePublish` and
`unschedule`; a timestamp alone never publishes content. `publishAt` is an
absolute instant and scheduling also requires an explicit IANA `timeZone`.

When `localization` is configured, `createTranslation` creates a locale
variant, `listLocaleVariants` lists variants for an entry, and `findBySlug`
can try explicit `fallbackLocales`. Slugs are unique by tenant, collection,
and locale; no arbitrary default-locale fallback is performed.

The configured lifecycle methods and their full type signatures are listed in
[Drafts, revisions, localization, and scheduling](https://puzzle-ui.com/docs/cms/lifecycle).

## Media references

CMS media values are asset-ID strings, not object keys or signed URLs. Supply a
tenant-aware `CmsMediaReferenceValidator` when constructing the request
instance; otherwise media references are rejected. CMS tracks draft and
published media usage through Storage so a host can protect permanent asset
deletion. Store file bytes through `@puzzle-ui/media` object-storage adapters,
not CMS.

## Change events and webhooks

`emitChangeEvents: true` writes metadata-only change events atomically with
successful mutations. When enabled,
`cms.events.list({ first?, after? })` returns a `CmsChangeEventPage`;
`cms.events.acknowledge(eventId, { expectedRevision })` acknowledges a durable
event. The API is tenant/actor bound and uses the configured service access
policy. Keep a custom consumer authorized and idempotent, acknowledge only
after its work is durable, and do not expose raw event records to browser
clients.

`CmsWebhookService` remains a separate server-side root export. It requires a
Storage adapter, explicit access policy, host transport, and server-side secret
resolver; there is no default HTTP transport. Its worker operations include
subscription management, `fanout`, delivery/attempt listing,
`retryDelivery`, and `runNext`. Keep SSRF protections at connection time, keep
secret values and references out of browser contracts, and make delivery
processing idempotent. Fullstack's optional webhook routes expose sanitized
client operations; they do not run delivery workers.

```ts
import { CmsWebhookService } from "@puzzle-ui/cms";

const webhooks = new CmsWebhookService({
  storage,
  accessPolicy,
  transport: hostWebhookTransport,
  resolveSecret: hostSecretResolver,
});
```

`storage`, `accessPolicy`, `hostWebhookTransport`, and `hostSecretResolver` are
server-owned dependencies. Subscription management methods include
`createSubscription`, `updateSubscription`, `listSubscriptions`,
`getSubscription`, and `assertCanManage`; worker methods include `fanout`,
`listDeliveries`, `listAttempts`, `retryDelivery`, and `runNext`. Each worker
operation receives trusted tenant/actor input and must be authorized and
idempotent. Drive `fanout` from `cms.events.list`; fanout records deliveries
and removes the corresponding outbox event itself, so do not separately
acknowledge an event after fanout. For other consumers, acknowledge only after
durable processing with the event's current revision.

`signCmsWebhook` and `verifyCmsWebhook` sign the exact raw body with
HMAC-SHA256. Verification requires a durable atomic replay store and up to
three active secrets for rotation. Couple replay reservation to durable
processing; these primitives do not provide outbound SSRF protection.

## Storage requirements

CMS uses only public `@puzzle-ui/storage` contracts. Mutations that write a
document and related revisions, audit events, outbox records, or media usage
require the adapter capabilities those operations depend on; unsupported
atomic batches, conditional writes, or uniqueness fail closed. Queries must
push tenant, collection, visibility, filters, ordering, and page bounds to the
adapter; CMS does not load an entire collection to filter or sort in memory.

Breaking schema changes require a consecutive version increment and an
explicit `CmsSchemaMigration`. Migration, validation, and custom-validator
callbacks are runtime functions; register them again after process restart.

## Development

```sh
bun run typecheck
bun run test
bun run build
```

See `AGENTS.md` and `ai/instructions.md` for security and persistence
requirements.
