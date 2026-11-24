# ADR 001: Code-first CMS architecture

**Status:** Approved for implementation  
**Scope:** `@puzzle-ui/cms` and its direct Fullstack, Storage, Media, and Pieces integrations

## Context

The current CMS is tenant-safe and has useful lifecycle, audit, media-usage,
outbox, and webhook guarantees, but its runtime content-type registration API
does not provide schema-derived application types. Entry filtering and sorting
also materialize all matching records in memory. The replacement must make
schemas static and code-first without weakening existing security or storage
guarantees.

Competitor documentation research found several transferable patterns:

- Payload makes collections the unit for schema, access, hooks, and editorial
  behavior; its broad field catalog is useful, but Puzzle will keep its public
  field factories smaller and framework-neutral.
- Sanity's reusable field/object definitions and field-local validation are
  useful. Puzzle will validate at the server/domain boundary as well as expose
  field metadata to authoring UIs; client-only validation is insufficient.
- Strapi distinguishes collection and singleton models and keeps drafts
  separate from published content. Puzzle will use collection singletons and
  immutable published snapshots rather than adding global content types.

## Decision

1. **Static schema is the source of truth.** `defineCMS` accepts a typed
   collection registry built with `collection`, `collection.singleton`, and
   `fields`. Developers do not register or mutate content types at runtime.
   The implementation may persist a versioned schema snapshot automatically
   to detect incompatible deployments and run explicit migrations; that
   snapshot is derived from code and is never a separate authoring source.
   Field definitions remain serializable except for explicitly supported
   server callbacks such as validation, access, and hooks.
2. **The configured API owns inference.** `createCms({ config, storage, ... })`
   returns collection and singleton services keyed by the schema. `find`,
   `findById`, `findBySlug`, `create`, `update`, `delete`, and query inputs infer
   their document and field types from that registry. No per-call schema or
   document generic is required.
3. **Request identity is bound once, server-side.** A CMS instance used for a
   request receives trusted tenant/user context from its host. Collection
   methods do not accept caller-supplied tenant or actor IDs. Collection
   policies can further restrict CRUD and field access; public reads are
   published-only. HTTP integrations must resolve context and authorize every
   request independently of browser input.
4. **Storage remains vendor-neutral.** CMS uses only public
   `@puzzle-ui/storage` contracts. Queries must apply tenant, collection,
   visibility, filter, order, and page bounds in the adapter; CMS must not
   load a collection to filter or sort it in process. Storage query paths may
   address validated nested content fields, and MongoDB/D1 must implement the
   same semantics before CMS relies on them.
5. **Integrity requirements are explicit.** Mutations that write a document
   and related revision, audit, outbox, or media-usage records require the
   adapter capabilities those operations need. Unsupported atomicity,
   conditional writes, or uniqueness fail closed. Published data is an
   immutable snapshot; draft content is never included in public projections.
6. **Optional behavior stays opt-in.** Drafts, localization, timestamps,
   revisions, hooks, scheduling, and webhook delivery are enabled only by
   collection/configuration options. Existing lifecycle mechanisms may be
   reused internally only after being adapted to the new schema and public API;
   the old runtime-registration API must not remain as a competing public CMS.
7. **Package boundaries remain strict.** CMS owns schema, validation, queries,
   lifecycle, and domain policies. Fullstack owns serializable HTTP/client and
   framework adapters. Storage and its adapters own query/persistence
   semantics. Media owns asset contracts and binary storage. Pieces remain
   controlled React authoring components and own no fetching, authorization,
   or persistence.

## Implementation contract

The public DSL is centered on:

```ts
const config = defineCMS({
  collections: {
    posts: collection({
      fields: {
        title: fields.text({ required: true }),
        slug: fields.slug({ from: "title" }),
      },
    }),
    settings: collection.singleton({
      fields: { siteName: fields.text({ required: true }) },
    }),
  },
});
```

`fields` includes type-specific factories for text, textarea, number, boolean,
date, datetime, email, URL, slug, select, multi-select, media, relationship,
rich text, JSON, array, object, blocks, computed, and custom values. Factories
carry the inferred value type. Required fields without defaults are required
on create; optional or defaulted fields are optional. Updates are typed partial
inputs. Collection and singleton values are inferred by collection key, and
relationship targets are checked against the configured keys.

The configured service surface is:

```ts
const cms = createCms({
  config,
  storage,
  context: { tenantId, user }, // trusted request-scoped host context
});

const page = await cms.posts.find({
  where: { status: { equals: "published" } },
  sort: "-publishedAt",
  limit: 20,
  page: 1,
});
const post = await cms.posts.findById("post_123");
const created = await cms.posts.create({ title: "First post" });
const updated = await cms.posts.update(created.id, { title: "Edited" });
await cms.posts.delete(updated.id);
```

`findBySlug` is available for collections with a slug field. The `where` type
supports `equals`, `notEquals`, `contains`, `in`, `notIn`, ordered comparisons,
`exists`, and nested `and`/`or`; sort fields are schema keys. Pagination and
relationship population are bounded and execute through Storage. A singleton
provides one stable document per tenant and collection rather than an ordinary
multi-record list API.

Services are configured once with this schema and a Storage adapter. A
request-scoped instance receives trusted `context`; an omitted context uses
the single-tenant `"default"` scope for local/server use. Context is bound at
the server boundary, not accepted as method input. The core factory remains
framework-neutral. Fullstack handlers must always resolve trusted context and
authorize each route; context, tenant, actor, and permissions are never taken
from browser payloads. If a collection declares an access policy, every
omitted action is denied. Public entry points return only published snapshots,
even when draft support is enabled. Advanced features and their public types
are documented only after runtime behavior and adapter guarantees are tested.

## Consequences

- Runtime schema authoring is removed; optional persisted schema snapshots
  support version checks/migrations while content remains separate from code
  definitions.
- Storage query contracts and both bundled adapters may need compatible
  nested-path/filter additions, with conformance coverage.
- Fullstack routes, browser-safe DTOs, Pieces types, examples, and docs must be
  migrated together. Server-only service/storage types must not leak into
  client entry points.
- This ADR does not promise a feature until its implementation, tests, exports,
  and documentation agree.
