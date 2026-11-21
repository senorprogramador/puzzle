import { describe, expect, it } from "bun:test";
import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageComparison,
} from "@puzzle-ui/storage";
import {
  CmsCapabilityError,
  CmsConflictError,
  CmsDuplicateError,
  CmsPermissionDeniedError,
  CmsSchemaError,
  CmsService,
  CmsWebhookService,
  CmsValidationError,
  ContentTypeRegistry,
  getBreakingSchemaChanges,
  normalizeCmsSlug,
  normalizeLocale,
  validateContentFields,
  validateContentTypeDefinition,
  verifyCmsWebhook,
  type CmsContentEntry,
  type CmsContentTypeRecord,
  type CmsScheduledPublication,
  type CmsSchemaMigration,
  type CmsServiceOptions,
  type CmsValue,
  type ContentTypeDefinition,
} from "../src";

type TestIndex = {
  readonly fields: readonly string[];
  readonly unique?: boolean;
};

class MemoryStorage {
  capabilities = {
    transactions: true,
    atomicBatch: true,
    conditionalWrites: true,
    uniqueConstraints: true,
    upsert: true,
    cursorPagination: true,
    migrations: false,
    ttlIndexes: false,
  };
  readonly collections = new Map<string, Map<string, Record<string, unknown>>>();
  readonly indexes = new Map<string, readonly TestIndex[]>();
  failChangeEventInsert = false;
  failDeliveryInsertAt = 0;
  deliveryInserts = 0;

  getCapabilities() {
    return { capabilities: this.capabilities };
  }

  async registerCollection<T>(
    collection: { readonly name: string; readonly indexes?: readonly TestIndex[] },
  ): Promise<void> {
    this.collections.set(collection.name, this.collections.get(collection.name) ?? new Map());
    this.indexes.set(collection.name, collection.indexes ?? []);
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    const record = this.collections.get(collection)?.get(id);
    return record ? structuredClone(record) as T : null;
  }

  async findOne<T>(
    collection: string,
    query: { readonly where?: Record<string, StorageComparison> },
  ): Promise<T | null> {
    return (await this.findMany<T>(collection, query))[0] ?? null;
  }

  async findMany<T>(
    collection: string,
    query: {
      readonly where?: Record<string, StorageComparison>;
      readonly orderBy?: readonly { readonly field: string; readonly direction: "asc" | "desc" }[];
      readonly limit?: number;
      readonly offset?: number;
    } = {},
  ): Promise<readonly T[]> {
    let rows = [...(this.collections.get(collection)?.values() ?? [])]
      .filter((record) => matchesWhere(record, query.where));
    for (const order of [...(query.orderBy ?? [])].reverse()) {
      rows.sort((left, right) => {
        const compared = compare(left[order.field], right[order.field]);
        return order.direction === "asc" ? compared : -compared;
      });

    }
    const offset = query.offset ?? 0;
    rows = rows.slice(offset, query.limit === undefined ? undefined : offset + query.limit);
    return structuredClone(rows) as T[];
  }

  async insert<T>(collection: string, input: Record<string, unknown>): Promise<T> {
    if (collection === "cms_webhook_deliveries" && ++this.deliveryInserts === this.failDeliveryInsertAt) {
      throw new Error("Delivery storage unavailable");
    }
    const rows = this.collections.get(collection);
    if (!rows) throw new Error(`Unknown collection ${collection}`);
    const id = String(input.id);
    if (rows.has(id)) throw new StorageDuplicateError("id");
    const record = {
      ...structuredClone(input),
      createdAt: input.createdAt ?? new Date(),
      updatedAt: input.updatedAt ?? new Date(),
      revision: input.revision ?? 1,
    };
    this.assertUnique(collection, record, id);
    rows.set(id, record);
    return structuredClone(record) as T;
  }

  async findPage<T>(
    collection: string,
    query: {
      readonly where?: Record<string, StorageComparison>;
      readonly first: number;
      readonly after?: { readonly value: string };
    },
  ) {
    const records = await this.findMany<Record<string, unknown>>(collection, {
      where: query.where,
      orderBy: [{ field: "id", direction: "asc" }],
    });
    const rows = records.filter((record) =>
      query.after === undefined || String(record.id) > query.after.value,
    );
    const items = rows.slice(0, query.first);
    const hasNextPage = rows.length > query.first;
    return {
      items: items as T[],
      hasNextPage,
      nextCursor: hasNextPage ? { value: String(items.at(-1)!.id) } : null,
    };
  }

  async delete(
    collection: string,
    id: string,
    condition?: { readonly expectedRevision?: number },
  ): Promise<boolean> {
    const rows = this.collections.get(collection);
    const record = rows?.get(id);
    if (!record) return false;
    if (condition?.expectedRevision !== undefined &&
        record.revision !== condition.expectedRevision) {
      throw new StorageConflictError();
    }
    return rows!.delete(id);
  }

  async atomicBatch<T>(operations: readonly Record<string, unknown>[]) {
    const backup = new Map(
      [...this.collections].map(([name, records]) => [
        name,
        new Map([...records].map(([id, record]) => [id, structuredClone(record)])),
      ]),
    );
    const results: Array<Record<string, unknown>> = [];
    try {
      for (const raw of operations) {
        const operation = raw as {
          readonly type: "insert" | "update" | "delete";
          readonly collection: string;
          readonly id?: string;
          readonly record?: Record<string, unknown>;
          readonly changes?: Record<string, unknown>;
          readonly condition?: { readonly expectedRevision?: number };
        };
        const rows = this.collections.get(operation.collection);
        if (!rows) throw new Error(`Unknown collection ${operation.collection}`);
        if (operation.type === "insert") {
          if (operation.collection === "cms_change_events" && this.failChangeEventInsert) {
            throw new Error("Change event storage failed");
          }
          const record = operation.record!;
          const id = String(record.id);
          if (rows.has(id)) throw new StorageDuplicateError("id");
          this.assertUnique(operation.collection, record, id);
          const inserted = {
            ...structuredClone(record),
            createdAt: record.createdAt ?? new Date(),
            updatedAt: record.updatedAt ?? new Date(),
            revision: record.revision ?? 1,
          };
          rows.set(id, inserted);
          results.push({ type: "insert", record: structuredClone(inserted) });
          continue;
        }
        const id = operation.id!;
        const existing = rows.get(id);
        if (
          !existing ||
          (operation.condition?.expectedRevision !== undefined &&
            existing.revision !== operation.condition.expectedRevision)
        ) {
          throw new StorageConflictError();
        }
        if (operation.type === "delete") {
          rows.delete(id);
          results.push({ type: "delete", deleted: true });
          continue;
        }
        const updated = {
          ...existing,
          ...structuredClone(operation.changes),
          revision: Number(existing.revision) + 1,
        };
        this.assertUnique(operation.collection, updated, id);
        rows.set(id, updated);
        results.push({ type: "update", record: structuredClone(updated) });
      }
    } catch (error) {
      this.collections.clear();
      backup.forEach((value, key) => this.collections.set(key, value));
      throw error;
    }
    return { results };
  }

  private assertUnique(
    collection: string,
    candidate: Record<string, unknown>,
    excludingId: string,
  ): void {
    for (const index of this.indexes.get(collection) ?? []) {
      if (!index.unique) continue;
      const values = index.fields.map((field) => candidate[field]);
      if (values.some((value) => value === undefined || value === null)) continue;
      const key = JSON.stringify(values);
      for (const [id, record] of this.collections.get(collection) ?? []) {
        if (id === excludingId) continue;
        const other = JSON.stringify(index.fields.map((field) => record[field]));
        if (key === other) throw new StorageDuplicateError("unique index");
      }
    }
  }
}

const matchesWhere = (
  record: Record<string, unknown>,
  where: Record<string, StorageComparison> | undefined,
): boolean =>
  Object.entries(where ?? {}).every(([field, comparison]) => {
    const operation = comparison as { operator: string; value: unknown };
    const value = record[field];
    switch (operation.operator) {
      case "eq": return value === operation.value;
      case "ne": return value !== operation.value;
      case "in": return (operation.value as unknown[]).includes(value);
      case "notIn": return !(operation.value as unknown[]).includes(value);
      case "exists": return Boolean(operation.value) === (value !== undefined);
      case "gt": return compare(value, operation.value) > 0;
      case "gte": return compare(value, operation.value) >= 0;
      case "lt": return compare(value, operation.value) < 0;
      case "lte": return compare(value, operation.value) <= 0;
      default: return false;
    }
  });

const compare = (left: unknown, right: unknown): number => {
  const leftValue = left instanceof Date ? left.getTime() : left;
  const rightValue = right instanceof Date ? right.getTime() : right;
  return leftValue === rightValue ? 0 : (leftValue as never) < (rightValue as never) ? -1 : 1;
};

const actor = { id: "editor" };
const tenantId = "tenant_a";
const baseDefinition = (): ContentTypeDefinition => ({
  slug: "article",
  name: "Article",
  version: 1,
  locales: ["en-US", "fr-FR"],
  defaultLocale: "en-US",
  fields: [
    { key: "title", type: "text", label: "Title", required: true, localized: true },
    { key: "path", type: "slug", label: "Slug", required: true, localized: true },
    { key: "category", type: "text", label: "Category", required: true },
    { key: "privateNote", type: "textarea", label: "Private note" },
  ],
});

const createCms = (
  overrides: Partial<CmsServiceOptions> = {},
  clock: () => Date = () => new Date("2026-01-01T00:00:00.000Z"),
) => {
  const storage = new MemoryStorage();
  const scheduled: CmsScheduledPublication[] = [];
  const cancelled: CmsScheduledPublication[] = [];
  const scheduler = {
    schedule: async (job: CmsScheduledPublication) => { scheduled.push(job); },
    cancel: async (job: CmsScheduledPublication) => { cancelled.push(job); },
  };
  let nextId = 0;
  const cms = new CmsService({
    storage: storage as never,
    accessPolicy: async () => true,
    scheduler,
    clock,
    idGenerator: () => `test-${++nextId}`,
    ...overrides,
  });
  return { cms, storage, scheduled, cancelled };
};

describe("CMS schema validation", () => {
  it("normalizes slugs and locales and validates nested values and defaults", async () => {
    expect(normalizeCmsSlug("  Über a title! ")).toBe("uber-a-title");
    expect(normalizeLocale("en-us")).toBe("en-US");

    const definition: ContentTypeDefinition = {
      slug: "page",
      name: "Page",
      version: 1,
      fields: [
        { key: "title", type: "text", label: "Title", required: true, defaultValue: "Home" },
        {
          key: "sections",
          type: "repeater",
          label: "Sections",
          fields: [
            { key: "heading", type: "text", label: "Heading", required: true },
          ],
        },
        {
          key: "body",
          type: "blocks",
          label: "Body",
          blocks: [
            {
              type: "quote",
              fields: [{ key: "text", type: "textarea", label: "Text", required: true }],
            },
          ],
        },
      ],
    };
    validateContentTypeDefinition(definition);
    const fields = await validateContentFields(
      definition,
      {
        sections: [{ heading: "Intro" }],
        body: [{ type: "quote", fields: { text: "Quoted" } }],
      },
      { tenantId, contentTypeSlug: "page", locale: "en-US", actor },
    );
    expect(fields.title).toBe("Home");
    expect(fields.sections).toEqual([{ heading: "Intro" }]);
  });

  it("rejects unknown fields and custom validator failures", async () => {
    const definition: ContentTypeDefinition = {
      slug: "profile",
      name: "Profile",
      version: 1,
      fields: [
        {
          key: "name",
          type: "text",
          label: "Name",
          required: true,
          customValidators: ["not-admin"],
        },
      ],
    };
    const validators = { "not-admin": (value: CmsValue) =>
      value === "admin" ? "Reserved name." : undefined };
    expect(() => validateContentTypeDefinition(definition, { customValidators: validators })).not.toThrow();
    await expect(
      validateContentFields(
        definition,
        { name: "admin", extra: true },
        { tenantId, contentTypeSlug: "profile", locale: "en-US", actor },
        { customValidators: validators },
      ),
    ).rejects.toBeInstanceOf(CmsValidationError);

    const nestedDefinition: ContentTypeDefinition = {
      slug: "nested",
      name: "Nested",
      version: 1,
      fields: [
        {
          key: "items",
          type: "repeater",
          label: "Items",
          fields: [
            {
              key: "value",
              type: "text",
              label: "Value",
              customValidators: ["not-admin"],
            },
          ],
        },
      ],
    };
    await expect(
      validateContentFields(
        nestedDefinition,
        { items: [{ value: "admin" }] },
        { tenantId, contentTypeSlug: "nested", locale: "en-US", actor },
        { customValidators: validators },
      ),
    ).rejects.toBeInstanceOf(CmsValidationError);
  });

  it("requires a schema version bump and migration for breaking changes", () => {
    const previous = baseDefinition();
    const next = { ...previous, version: 2, fields: previous.fields.filter((field) => field.key !== "privateNote") };
    expect(getBreakingSchemaChanges(previous, next)).toContain("privateNote: removed");
    const registry = new ContentTypeRegistry();
    registry.register(tenantId, previous);
    expect(() => registry.register(tenantId, { ...previous, name: "Changed" })).toThrow(CmsSchemaError);
  });
});

describe("CmsService", () => {
  it("keeps revisions immutable and serves only the published snapshot publicly", async () => {
    const { cms } = createCms();
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    expect(await cms.listContentTypes({ tenantId, actor })).toHaveLength(1);
    const created = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-us",
      fields: { title: "First title", path: " First title ", category: "news", privateNote: "private v1" },
    });
    expect(created.slug).toBe("first-title");
    expect(created.locale).toBe("en-US");

    const published = await cms.publish({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: created.revision,
    });
    const draft = await cms.saveDraft({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: published.revision,
      fields: { title: "Updated title", path: "updated-title", category: "news", privateNote: "private v2" },
    });
    expect(draft.status).toBe("draft");
    const publicEntry = await cms.getEntry({
      tenantId,
      actor: null,
      entryId: created.id,
      visibility: "public",
    });
    expect(publicEntry.fields.title).toBe("First title");
    expect(publicEntry.fields.privateNote).toBe("private v1");

    const revisions = await cms.listRevisions({ tenantId, actor, entryId: created.id });
    expect(revisions.map((revision) => revision.revisionNumber)).toEqual([3, 2, 1]);
    expect(revisions[1]?.fields.title).toBe("First title");
    await expect(
      cms.publish({
        tenantId,
        actor,
        entryId: created.id,
        expectedRevision: published.revision,
      }),
    ).rejects.toBeInstanceOf(CmsConflictError);
    const unpublished = await cms.unpublish({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: draft.revision,
    });
    expect(unpublished.publishedSnapshot).toBeNull();
    await expect(
      cms.getEntry({ tenantId, actor: null, entryId: created.id, visibility: "public" }),
    ).rejects.toThrow();
    const archived = await cms.archive({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: unpublished.revision,
    });
    expect(archived.status).toBe("archived");
  });

  it("uses conditional storage writes to resolve concurrent edits", async () => {
    const { cms } = createCms();
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const entry = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Original", path: "original", category: "news" },
    });
    const edits = await Promise.allSettled([
      cms.saveDraft({
        tenantId,
        actor,
        entryId: entry.id,
        expectedRevision: entry.revision,
        fields: { title: "First writer", path: "first-writer", category: "news" },
      }),
      cms.saveDraft({
        tenantId,
        actor,
        entryId: entry.id,
        expectedRevision: entry.revision,
        fields: { title: "Second writer", path: "second-writer", category: "news" },
      }),
    ]);
    expect(edits.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    const conflict = edits.find((result) => result.status === "rejected");
    expect(conflict?.status === "rejected" && conflict.reason).toBeInstanceOf(CmsConflictError);
    expect(await cms.listRevisions({ tenantId, actor, entryId: entry.id })).toHaveLength(2);
  });

  it("fails closed when the storage adapter lacks atomic capabilities", async () => {
    const storage = new MemoryStorage();
    storage.capabilities.atomicBatch = false;
    const cms = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => "unused",
    });
    await expect(
      cms.registerContentType({ tenantId, actor, definition: baseDefinition() }),
    ).rejects.toBeInstanceOf(CmsCapabilityError);
  });

  it("enforces explicit scheduling and ignores stale jobs", async () => {
    const { storage, scheduled, cancelled } = createCms();
    let nextId = 0;
    const idGenerator = () => `schedule-test-${++nextId}`;
    const noSchedulerCms = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator,
    });
    await noSchedulerCms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const created = await noSchedulerCms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Future", path: "future", category: "news" },
    });
    await expect(
      noSchedulerCms.schedulePublish({
        tenantId,
        actor,
        entryId: created.id,
        expectedRevision: created.revision,
        publishAt: new Date("2026-01-02T00:00:00.000Z"),
        timeZone: "America/Los_Angeles",
      }),
    ).rejects.toBeInstanceOf(CmsCapabilityError);

    let now = new Date("2026-01-01T00:00:00.000Z");
    const scheduledCms = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      scheduler: {
        schedule: async (job) => { scheduled.push(job); },
        cancel: async (job) => { cancelled.push(job); },
      },
      clock: () => now,
      idGenerator,
    });
    const scheduledEntry = await scheduledCms.schedulePublish({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: created.revision,
      publishAt: new Date("2026-01-02T00:00:00.000Z"),
      timeZone: "America/Los_Angeles",
    });
    const job = scheduled[0]!;
    expect(job.timeZone).toBe("America/Los_Angeles");
    expect(scheduledEntry.status).toBe("scheduled");
    const earlyResult = await scheduledCms.publishScheduled({ tenantId, actor: null, publication: job });
    expect(earlyResult).toEqual({ published: false, reason: "not-due" });

    const edited = await scheduledCms.saveDraft({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: scheduledEntry.revision,
      fields: { title: "Changed", path: "changed", category: "news" },
    });
    expect(edited.status).toBe("draft");
    expect(cancelled).toHaveLength(1);
    expect(await scheduledCms.publishScheduled({ tenantId, actor: null, publication: job })).toEqual({
      published: false,
      reason: "stale",
    });

    const nextJobResult = await scheduledCms.schedulePublish({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: edited.revision,
      publishAt: new Date("2026-01-03T00:00:00.000Z"),
      timeZone: "America/Los_Angeles",
    });
    now = new Date("2026-01-03T00:00:00.000Z");
    const result = await scheduledCms.publishScheduled({
      tenantId,
      actor: null,
      publication: scheduled[1]!,
    });
    expect(nextJobResult.status).toBe("scheduled");
    expect(result.published).toBe(true);
    if (result.published) expect(result.entry.status).toBe("published");
  });

  it("enforces locale uniqueness, explicit fallback, filtering, search, and cursors", async () => {
    const { cms } = createCms();
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const english = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Hello world", path: "hello-world", category: "news" },
    });
    const french = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "fr-FR",
      translationGroupId: english.translationGroupId,
      fields: { title: "Bonjour le monde", path: "bonjour", category: "news" },
    });
    expect(french.translationGroupId).toBe(english.translationGroupId);
    await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Hello again", path: "hello-again", category: "news" },
    });
    await expect(
      cms.findEntry({ tenantId, actor, contentType: "article", locale: "fr-FR", slug: "hello-world", visibility: "admin" }),
    ).rejects.toThrow();
    const fallback = await cms.findEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "fr-FR",
      slug: "hello-world",
      fallbackLocales: ["en-US"],
      visibility: "admin",
    });
    expect(fallback.resolvedLocale).toBe("en-US");
    await expect(
      cms.createEntry({
        tenantId,
        actor,
        contentType: "article",
        locale: "en-US",
        fields: { title: "Duplicate", path: "hello world", category: "news" },
      }),
    ).rejects.toBeInstanceOf(CmsDuplicateError);

    const page = await cms.listEntries({
      tenantId,
      actor,
      contentType: "article",
      first: 1,
      visibility: "admin",
      locale: "en-US",
      search: "hello",
      filters: [{ field: "category", operator: "eq", value: "news" }],
    });
    expect(page.items).toHaveLength(1);
    expect(page.hasNextPage).toBe(true);
    const nextPage = await cms.listEntries({
      tenantId,
      actor,
      contentType: "article",
      first: 1,
      visibility: "admin",
      locale: "en-US",
      search: "hello",
      filters: [{ field: "category", operator: "eq", value: "news" }],
      after: page.nextCursor!,
    });
    expect(nextPage.items).toHaveLength(1);
    expect(nextPage.items[0]?.id).not.toBe(page.items[0]?.id);
    expect(nextPage.hasNextPage).toBe(false);
  });

  it("validates relation and media references and keeps scopes tenant-bound", async () => {
    const { cms } = createCms({
      mediaReferenceValidator: {
        assertCanReference: async ({ tenantId: scope, assetId }) => {
          if (scope !== tenantId || assetId !== "asset_1") throw new Error("not found");
        },
      },
    });
    await cms.registerContentType({
      tenantId,
      actor,
      definition: {
        slug: "author",
        name: "Author",
        version: 1,
        fields: [{ key: "name", type: "text", label: "Name", required: true }],
      },
    });
    await cms.registerContentType({
      tenantId,
      actor,
      definition: {
        slug: "story",
        name: "Story",
        version: 1,
        fields: [
          { key: "title", type: "text", label: "Title", required: true },
          { key: "cover", type: "media", label: "Cover" },
          {
            key: "author",
            type: "relationship",
            label: "Author",
            relation: { targetTypes: ["author"], sameLocale: true },
          },
        ],
      },
    });
    const authorEntry = await cms.createEntry({
      tenantId,
      actor,
      contentType: "author",
      locale: "en-US",
      fields: { name: "Writer" },
      slug: "writer",
    });
    const story = await cms.createEntry({
      tenantId,
      actor,
      contentType: "story",
      locale: "en-US",
      fields: { title: "Story", cover: "asset_1", author: authorEntry.id },
      slug: "story",
    });
    expect(story.fields.author).toBe(authorEntry.id);
    const draftUsages = await cms.listMediaUsages({
      tenantId,
      actor,
      assetId: "asset_1",
    });
    expect(draftUsages.map((usage) => usage.usageType)).toEqual(["draft"]);
    const publishedStory = await cms.publish({
      tenantId,
      actor,
      entryId: story.id,
      expectedRevision: story.revision,
    });
    const publishedUsages = await cms.listMediaUsages({
      tenantId,
      actor,
      assetId: "asset_1",
    });
    expect(publishedUsages.map((usage) => usage.usageType).sort()).toEqual(["draft", "published"]);
    await cms.unpublish({
      tenantId,
      actor,
      entryId: story.id,
      expectedRevision: publishedStory.revision,
    });
    const afterUnpublish = await cms.listMediaUsages({
      tenantId,
      actor,
      assetId: "asset_1",
    });
    expect(afterUnpublish.map((usage) => usage.usageType)).toEqual(["draft"]);
    await expect(
      cms.getEntry({
        tenantId: "tenant_b",
        actor,
        entryId: story.id,
        visibility: "admin",
      }),
    ).rejects.toThrow();
    await expect(
      cms.createEntry({
        tenantId,
        actor,
        contentType: "story",
        locale: "en-US",
        fields: { title: "Bad relation", cover: "missing", author: "unknown" },
        slug: "bad-relation",
      }),
    ).rejects.toBeInstanceOf(CmsValidationError);
  });

  it("requires policy authorization, redacts fields, and audits denied actions", async () => {
    const { cms } = createCms({
      accessPolicy: async ({ action, fieldPath }) =>
        action !== "entry:delete" &&
        !(action === "field:read" && fieldPath === "privateNote"),
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const entry = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Private", path: "private", category: "news", privateNote: "secret" },
    });
    const published = await cms.publish({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: entry.revision,
    });
    const read = await cms.getEntry({ tenantId, actor, entryId: entry.id, visibility: "admin" });
    expect(read.fields.privateNote).toBeUndefined();
    expect(read.publishedSnapshot?.fields.privateNote).toBeUndefined();
    await expect(
      cms.deleteEntry({ tenantId, actor, entryId: entry.id, expectedRevision: published.revision }),
    ).rejects.toBeInstanceOf(CmsPermissionDeniedError);
    const audit = await cms.listAuditEvents({ tenantId, actor, resourceId: entry.id });
    expect(audit.some((event) => event.result === "denied" && event.action === "entry:delete")).toBe(true);

    const noPolicyStorage = new MemoryStorage();
    expect(() => new CmsService({ storage: noPolicyStorage as never } as never)).toThrow(TypeError);
  });

  it("atomically emits metadata-only change events and acknowledges them with tenant and policy checks", async () => {
    let canAcknowledge = false;
    const { cms } = createCms({
      emitChangeEvents: true,
      accessPolicy: async ({ action }) => action !== "change-event:ack" || canAcknowledge,
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const entry = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Private draft", path: "private-draft", category: "news" },
    });
    const first = await cms.listChangeEvents({ tenantId, actor, first: 1 });
    expect(first.items).toHaveLength(1);
    expect(first.hasNextPage).toBe(true);
    expect(first.nextCursor).not.toBeNull();
    const second = await cms.listChangeEvents({ tenantId, actor, first: 1, after: first.nextCursor! });
    expect(second.items).toHaveLength(1);
    expect(second.hasNextPage).toBe(false);
    const events = [...first.items, ...second.items];
    expect(events.map((event) => event.action).sort()).toEqual(["content-type:create", "entry:create"]);
    const entryEvent = events.find((event) => event.resource === "entry")!;
    expect(entryEvent.resourceId).toBe(entry.id);
    expect(entryEvent.revisionNumber).toBe(1);
    expect(JSON.stringify(events)).not.toContain("Private draft");
    expect((await cms.listChangeEvents({ tenantId: "tenant_b", actor })).items).toHaveLength(0);
    await expect(cms.acknowledgeChangeEvent({
      tenantId: "tenant_b", actor, eventId: entryEvent.id, expectedRevision: entryEvent.revision,
    })).rejects.toThrow("not found");
    await expect(cms.acknowledgeChangeEvent({
      tenantId, actor, eventId: entryEvent.id, expectedRevision: entryEvent.revision,
    })).rejects.toBeInstanceOf(CmsPermissionDeniedError);
    canAcknowledge = true;
    await expect(cms.acknowledgeChangeEvent({
      tenantId, actor, eventId: entryEvent.id, expectedRevision: entryEvent.revision + 1,
    })).rejects.toBeInstanceOf(CmsConflictError);
    await cms.acknowledgeChangeEvent({
      tenantId, actor, eventId: entryEvent.id, expectedRevision: entryEvent.revision,
    });
    expect((await cms.listChangeEvents({ tenantId, actor })).items).toHaveLength(1);
    await expect(cms.acknowledgeChangeEvent({
      tenantId, actor, eventId: entryEvent.id, expectedRevision: entryEvent.revision,
    })).rejects.toThrow("not found");
  });

  it("rolls back CMS mutations when the enabled change outbox cannot persist", async () => {
    const { cms, storage } = createCms({ emitChangeEvents: true });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    storage.failChangeEventInsert = true;
    await expect(cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Draft", path: "draft", category: "news" },
    })).rejects.toThrow("Change event storage failed");
    expect(storage.collections.get("cms_content_entries")?.size).toBe(0);
    expect(storage.collections.get("cms_content_revisions")?.size).toBe(0);
    expect(storage.collections.get("cms_audit_events")?.size).toBe(1);
    expect(storage.collections.get("cms_change_events")?.size).toBe(1);
  });

  it("allows workers to continue scanning when individual events are hidden", async () => {
    let hiddenEventId: string | undefined;
    const { cms } = createCms({
      emitChangeEvents: true,
      accessPolicy: async ({ action, resourceId }) =>
        action !== "change-event:read" || resourceId === undefined || resourceId !== hiddenEventId,
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Draft", path: "draft", category: "news" },
    });
    const first = await cms.listChangeEvents({ tenantId, actor, first: 1 });
    hiddenEventId = first.items[0]!.id;
    const hidden = await cms.listChangeEvents({ tenantId, actor, first: 1 });
    expect(hidden.items).toHaveLength(0);
    expect(hidden.hasNextPage).toBe(true);
    const next = await cms.listChangeEvents({ tenantId, actor, first: 1, after: hidden.nextCursor! });
    expect(next.items).toHaveLength(1);
    expect(next.items[0]!.id).not.toBe(hiddenEventId);
  });

  it("retains lifecycle events across service restarts and allows only one acknowledgement", async () => {
    const { cms, storage } = createCms({ emitChangeEvents: true });
    const type = await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    await cms.registerContentType({
      tenantId,
      actor,
      definition: { ...baseDefinition(), name: "Articles", version: 2 },
      expectedRevision: type.revision,
    });
    const entry = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Draft", path: "draft", category: "news" },
    });
    const published = await cms.publish({
      tenantId, actor, entryId: entry.id, expectedRevision: entry.revision,
    });
    await cms.unpublish({
      tenantId, actor, entryId: entry.id, expectedRevision: published.revision,
    });
    const restarted = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
    });
    const events = (await restarted.listChangeEvents({ tenantId, actor })).items;
    expect(events.map((event) => event.action).sort()).toEqual([
      "content-type:create", "content-type:update", "entry:create", "entry:publish", "entry:unpublish",
    ]);
    const event = events.find((item) => item.action === "entry:publish")!;
    const attempts = await Promise.allSettled([
      restarted.acknowledgeChangeEvent({ tenantId, actor, eventId: event.id, expectedRevision: event.revision }),
      restarted.acknowledgeChangeEvent({ tenantId, actor, eventId: event.id, expectedRevision: event.revision }),
    ]);
    expect(attempts.filter((attempt) => attempt.status === "fulfilled")).toHaveLength(1);
    expect(attempts.filter((attempt) => attempt.status === "rejected")).toHaveLength(1);
    expect((await restarted.listChangeEvents({ tenantId, actor })).items).toHaveLength(4);
  });

  it("does not emit change events by default and requires queue capabilities when enabled", async () => {
    const defaultCms = createCms();
    await defaultCms.cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    expect((await defaultCms.cms.listChangeEvents({ tenantId, actor })).items).toHaveLength(0);
    const enabled = createCms({ emitChangeEvents: true });
    enabled.storage.capabilities.cursorPagination = false;
    await expect(enabled.cms.registerContentType({
      tenantId, actor, definition: baseDefinition(),
    })).rejects.toBeInstanceOf(CmsCapabilityError);
    expect(enabled.storage.collections.get("cms_content_types")?.size).toBe(0);
  });

  it("lets a policy distinguish public reads from admin reads", async () => {
    const { cms } = createCms({
      accessPolicy: async ({ actor: requestActor, action, resource, visibility }) =>
        requestActor !== null ||
        (resource === "entry" &&
          (action === "entry:read" || action === "field:read") &&
          visibility === "public"),
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const draft = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Public page", path: "public-page", category: "news" },
    });
    const published = await cms.publish({
      tenantId,
      actor,
      entryId: draft.id,
      expectedRevision: draft.revision,
    });
    await expect(
      cms.getEntry({
        tenantId,
        actor: null,
        entryId: draft.id,
        visibility: "admin",
      }),
    ).rejects.toBeInstanceOf(CmsPermissionDeniedError);
    const publicEntry = await cms.getEntry({
      tenantId,
      actor: null,
      entryId: published.id,
      visibility: "public",
    });
    expect(publicEntry.fields.title).toBe("Public page");
  });

  it("requires and applies migrations for breaking schema versions", async () => {
    const { cms } = createCms();
    const type = await cms.registerContentType({
      tenantId,
      actor,
      definition: {
        slug: "note",
        name: "Note",
        version: 1,
        fields: [{ key: "title", type: "text", label: "Title", required: true }],
      },
    });
    const entry = await cms.createEntry({
      tenantId,
      actor,
      contentType: "note",
      locale: "en-US",
      fields: { title: "Legacy" },
      slug: "legacy",
    });
    const nextDefinition: ContentTypeDefinition = {
      slug: "note",
      name: "Note",
      version: 2,
      fields: [{ key: "heading", type: "text", label: "Heading", required: true }],
    };
    await expect(
      cms.registerContentType({
        tenantId,
        actor,
        definition: nextDefinition,
        expectedRevision: type.revision,
      }),
    ).rejects.toBeInstanceOf(CmsSchemaError);
    const migration: CmsSchemaMigration = {
      contentTypeSlug: "note",
      fromVersion: 1,
      toVersion: 2,
      migrate: (fields) => ({ heading: fields.title ?? "" }),
    };
    await cms.registerContentType({
      tenantId,
      actor,
      definition: nextDefinition,
      expectedRevision: type.revision,
      migration,
    });
    const migrated = await cms.getEntry({ tenantId, actor, entryId: entry.id, visibility: "admin" });
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.fields).toEqual({ heading: "Legacy" });
    const restored = await cms.restoreRevision({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: migrated.revision,
      revisionId: (await cms.listRevisions({ tenantId, actor, entryId: entry.id }))[0]!.id,
    });
    expect(restored.status).toBe("draft");
    expect(restored.fields.heading).toBe("Legacy");
  });
});

describe("CMS webhook delivery", () => {
  it("allows only one concurrent fanout and delivery claim", async () => {
    let id = 0;
    let sends = 0;
    let release!: () => void;
    const waiting = new Promise<void>((resolve) => { release = resolve; });
    const { cms, storage } = createCms({ emitChangeEvents: true });
    const hooks = new CmsWebhookService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => `hook-${++id}`,
      resolveSecret: async () => new Uint8Array(32).fill(1),
      transport: { async send() { sends += 1; await waiting; return { status: 204 }; } },
    });
    const subscription = await hooks.createSubscription({
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["content-type:create"], enabled: true, secretRef: "vault/current",
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const event = (await cms.listChangeEvents({ tenantId, actor })).items[0]!;
    const fanouts = await Promise.allSettled([
      hooks.fanout({ tenantId, actor, eventId: event.id, expectedRevision: event.revision }),
      hooks.fanout({ tenantId, actor, eventId: event.id, expectedRevision: event.revision }),
    ]);
    expect(fanouts.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect((await hooks.listDeliveries({ tenantId, actor, subscriptionId: subscription.id }))).toHaveLength(1);
    const first = hooks.runNext({ tenantId, actor });
    const second = hooks.runNext({ tenantId, actor });
    const pendingOutcomes = Promise.allSettled([first, second]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    release();
    const outcomes = await pendingOutcomes;
    expect(sends).toBe(1);
    expect(outcomes.filter((result) => result.status === "fulfilled" && result.value?.status === "delivered")).toHaveLength(1);
    const delivery = (await hooks.listDeliveries({ tenantId, actor, subscriptionId: subscription.id }))[0]!;
    expect((await hooks.listAttempts({ tenantId, actor, deliveryId: delivery.id }))).toHaveLength(1);
  });

  it("fans out subscribed events, retries failures, signs deliveries, and records history", async () => {
    let now = new Date("2026-01-01T00:00:00.000Z").getTime();
    const clock = () => new Date(now);
    const { cms, storage } = createCms({ emitChangeEvents: true }, clock);
    const secret = new Uint8Array(32).fill(7);
    const requests: Array<{ body: Uint8Array; signature: string; deliveryId: string }> = [];
    let id = 0;
    const hooks = new CmsWebhookService({
      storage: storage as never,
      accessPolicy: async () => true,
      clock,
      idGenerator: () => `hook-${++id}`,
      retryDelayMs: 1_000,
      resolveSecret: async () => secret,
      transport: {
        async send(input) {
          requests.push(input);
          return { status: requests.length === 1 ? 503 : 204 };
        },
      },
    });
    const subscription = await hooks.createSubscription({
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["entry:publish"], enabled: true, secretRef: "vault/current",
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const draft = await cms.createEntry({
      tenantId, actor, contentType: "article", locale: "en-US",
      fields: { title: "Secret draft", path: "draft", category: "news" },
    });
    await cms.publish({ tenantId, actor, entryId: draft.id, expectedRevision: draft.revision });
    const pending = (await cms.listChangeEvents({ tenantId, actor })).items;
    expect(pending).toHaveLength(3);
    for (const event of pending) {
      await hooks.fanout({ tenantId, actor, eventId: event.id, expectedRevision: event.revision });
    }
    expect((await cms.listChangeEvents({ tenantId, actor })).items).toHaveLength(0);
    expect((await hooks.runNext({ tenantId, actor }))?.status).toBe("pending");
    expect(await hooks.runNext({ tenantId, actor })).toBeNull();
    now += 1_000;
    const delivered = await hooks.runNext({ tenantId, actor });
    expect(delivered?.status).toBe("delivered");
    expect(delivered?.attempts).toBe(2);
    expect(requests).toHaveLength(2);
    expect(new TextDecoder().decode(requests[1]!.body)).not.toContain("Secret draft");
    expect(await verifyCmsWebhook({
      secrets: [secret], deliveryId: requests[1]!.deliveryId,
      signature: requests[1]!.signature, body: requests[1]!.body,
      scope: "endpoint", now, replayStore: { consume: async () => true },
    })).toEqual({ valid: true });
    const deliveries = await hooks.listDeliveries({ tenantId, actor, subscriptionId: subscription.id });
    expect(deliveries).toHaveLength(1);
    const attempts = await hooks.listAttempts({ tenantId, actor, deliveryId: deliveries[0]!.id });
    expect(attempts.map((attempt) => attempt.status)).toEqual([204, 503]);
    expect((await hooks.listSubscriptions({ tenantId: "tenant_b", actor }))).toHaveLength(0);
    await expect(hooks.listAttempts({
      tenantId: "tenant_b", actor, deliveryId: deliveries[0]!.id,
    })).rejects.toThrow("not found");
  });

  it("reclaims expired leases without losing attempt history", async () => {
    let now = new Date("2026-01-01T00:00:00.000Z").getTime();
    let sends = 0;
    let id = 0;
    const clock = () => new Date(now);
    const { cms, storage } = createCms({ emitChangeEvents: true }, clock);
    const hooks = new CmsWebhookService({
      storage: storage as never, accessPolicy: async () => true, clock,
      idGenerator: () => `hook-${++id}`, leaseMs: 1_000, timeoutMs: 500,
      resolveSecret: async () => new Uint8Array(32).fill(8),
      transport: { async send() { sends += 1; if (sends === 1) now += 1_000; return { status: 204 }; } },
    });
    const subscription = await hooks.createSubscription({
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["content-type:create"], enabled: true, secretRef: "vault/current",
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const event = (await cms.listChangeEvents({ tenantId, actor })).items[0]!;
    await hooks.fanout({ tenantId, actor, eventId: event.id, expectedRevision: event.revision });
    await expect(hooks.runNext({ tenantId, actor })).rejects.toBeInstanceOf(CmsConflictError);
    const delivery = await hooks.runNext({ tenantId, actor });
    expect(delivery?.status).toBe("delivered");
    const attempts = await hooks.listAttempts({ tenantId, actor, deliveryId: delivery!.id });
    expect(attempts.map((attempt) => attempt.failure)).toEqual([null, "lease-expired"]);
    expect((await hooks.listDeliveries({ tenantId, actor, subscriptionId: subscription.id }))).toHaveLength(1);
  });

  it("recovers partial fanout without duplicates and prevents acknowledgement while leased", async () => {
    let now = new Date("2026-01-01T00:00:00.000Z").getTime();
    let id = 0;
    const clock = () => new Date(now);
    const { cms, storage } = createCms({ emitChangeEvents: true }, clock);
    const hooks = new CmsWebhookService({
      storage: storage as never, accessPolicy: async () => true, clock,
      idGenerator: () => `hook-${++id}`, leaseMs: 1_000, timeoutMs: 500,
      resolveSecret: async () => new Uint8Array(32).fill(8),
      transport: { send: async () => ({ status: 204 }) },
    });
    const input = {
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["content-type:create"] as const, enabled: true, secretRef: "vault/current",
    };
    const first = await hooks.createSubscription(input);
    const second = await hooks.createSubscription(input);
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const event = (await cms.listChangeEvents({ tenantId, actor })).items[0]!;
    storage.failDeliveryInsertAt = 2;
    await expect(hooks.fanout({
      tenantId, actor, eventId: event.id, expectedRevision: event.revision,
    })).rejects.toThrow("Delivery storage unavailable");
    const leased = (await cms.listChangeEvents({ tenantId, actor })).items[0]!;
    await expect(cms.acknowledgeChangeEvent({
      tenantId, actor, eventId: leased.id, expectedRevision: leased.revision,
    })).rejects.toBeInstanceOf(CmsConflictError);
    await expect(hooks.fanout({
      tenantId, actor, eventId: leased.id, expectedRevision: leased.revision,
    })).rejects.toBeInstanceOf(CmsConflictError);
    now += 1_000;
    expect(await hooks.fanout({
      tenantId, actor, eventId: leased.id, expectedRevision: leased.revision,
    })).toBe(1);
    expect((await cms.listChangeEvents({ tenantId, actor })).items).toHaveLength(0);
    expect((await hooks.listDeliveries({ tenantId, actor, subscriptionId: first.id }))).toHaveLength(1);
    expect((await hooks.listDeliveries({ tenantId, actor, subscriptionId: second.id }))).toHaveLength(1);
  });

  it("requires authorization, validates endpoints, and retries with the current rotated secret", async () => {
    let allowed = false;
    let status = 400;
    let id = 0;
    const { cms, storage } = createCms({ emitChangeEvents: true });
    const keys = { old: new Uint8Array(32).fill(1), current: new Uint8Array(32).fill(2) };
    let signed: { body: Uint8Array; signature: string; deliveryId: string } | undefined;
    const hooks = new CmsWebhookService({
      storage: storage as never,
      accessPolicy: async ({ action }) => action !== "webhook:manage" || allowed,
      clock: () => new Date("2026-01-01T00:00:00.000Z"),
      idGenerator: () => `hook-${++id}`,
      resolveSecret: async ({ secretRef }) => keys[secretRef as keyof typeof keys],
      transport: { async send(input) { signed = input; return { status }; } },
    });
    const input = {
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["content-type:create"] as const, enabled: true, secretRef: "old",
    };
    await expect(hooks.createSubscription(input)).rejects.toBeInstanceOf(CmsPermissionDeniedError);
    allowed = true;
    await expect(hooks.createSubscription({
      ...input, endpoint: "https://user:pass@example.test/hook",
    })).rejects.toBeInstanceOf(CmsValidationError);
    await expect(hooks.createSubscription({
      ...input, endpoint: "https://example.test/hook?token=secret",
    })).rejects.toBeInstanceOf(CmsValidationError);
    const subscription = await hooks.createSubscription(input);
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const event = (await cms.listChangeEvents({ tenantId, actor })).items[0]!;
    await hooks.fanout({ tenantId, actor, eventId: event.id, expectedRevision: event.revision });
    const failed = await hooks.runNext({ tenantId, actor });
    expect(failed?.status).toBe("failed");
    expect(failed?.lastFailure).toBe("http");
    await expect(hooks.updateSubscription({
      ...input, subscriptionId: subscription.id, expectedRevision: subscription.revision + 1,
      secretRef: "current",
    })).rejects.toBeInstanceOf(CmsConflictError);
    await hooks.updateSubscription({
      ...input, subscriptionId: subscription.id, expectedRevision: subscription.revision,
      secretRef: "current",
    });
    await hooks.retryDelivery({
      tenantId, actor, deliveryId: failed!.id, expectedRevision: failed!.revision,
    });
    status = 204;
    expect((await hooks.runNext({ tenantId, actor }))?.status).toBe("delivered");
    expect(await verifyCmsWebhook({
      secrets: [keys.current], deliveryId: signed!.deliveryId, signature: signed!.signature,
      body: signed!.body, scope: "endpoint", now: new Date("2026-01-01T00:00:00.000Z").getTime(),
      replayStore: { consume: async () => true },
    })).toEqual({ valid: true });
    const audits = await cms.listAuditEvents({ tenantId, actor });
    expect(audits.some((event) => event.action === "webhook:manage" && event.result === "denied")).toBe(true);
    expect(JSON.stringify(audits)).not.toContain("hooks.example.test");
  });

  it("limits retries, sanitizes transport failures, and cancels disabled subscriptions", async () => {
    let now = new Date("2026-01-01T00:00:00.000Z").getTime();
    let id = 0;
    const clock = () => new Date(now);
    const { cms, storage } = createCms({ emitChangeEvents: true }, clock);
    const hooks = new CmsWebhookService({
      storage: storage as never, accessPolicy: async () => true, clock,
      idGenerator: () => `hook-${++id}`, retryDelayMs: 1_000, maxAttempts: 2,
      resolveSecret: async () => new Uint8Array(32).fill(8),
      transport: { async send() { throw new Error("sensitive provider details"); } },
    });
    const input = {
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["content-type:create"] as const, enabled: true, secretRef: "vault/current",
    };
    const subscription = await hooks.createSubscription(input);
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const event = (await cms.listChangeEvents({ tenantId, actor })).items[0]!;
    await hooks.fanout({ tenantId, actor, eventId: event.id, expectedRevision: event.revision });
    expect((await hooks.runNext({ tenantId, actor }))?.status).toBe("pending");
    now += 1_000;
    const failed = await hooks.runNext({ tenantId, actor });
    expect(failed?.status).toBe("failed");
    expect(failed?.lastFailure).toBe("transport");
    const history = await hooks.listAttempts({ tenantId, actor, deliveryId: failed!.id });
    expect(history).toHaveLength(2);
    expect(JSON.stringify(history)).not.toContain("sensitive provider details");
    await expect(hooks.retryDelivery({
      tenantId, actor, deliveryId: failed!.id, expectedRevision: failed!.revision + 1,
    })).rejects.toBeInstanceOf(CmsConflictError);
    await hooks.retryDelivery({
      tenantId, actor, deliveryId: failed!.id, expectedRevision: failed!.revision,
    });
    await hooks.updateSubscription({
      ...input, enabled: false, subscriptionId: subscription.id, expectedRevision: subscription.revision,
    });
    const cancelled = await hooks.runNext({ tenantId, actor });
    expect(cancelled?.status).toBe("cancelled");
    expect(cancelled?.lastFailure).toBe("disabled");
  });
});
