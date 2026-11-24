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
  CmsSchedulerError,
  CmsSchemaError,
  CmsWebhookService,
  CmsValidationError,
  collection,
  createCms as createTypedCms,
  defineCMS,
  fields,
  verifyCmsWebhook,
} from "../src";
import {
  CmsService,
  type CmsServiceOptions,
} from "../src/service";
import {
  ContentTypeRegistry,
  getBreakingSchemaChanges,
  normalizeCmsSlug,
  normalizeLocale,
  validateContentFields,
  validateContentTypeDefinition,
} from "../src/schema";
import type {
  CmsContentEntry,
  CmsContentTypeRecord,
  CmsScheduledPublication,
  CmsSchemaMigration,
  CmsValue,
  ContentTypeDefinition,
} from "../src/types";

type TestIndex = {
  readonly fields: readonly string[];
  readonly unique?: boolean;
};

type TestStorageQuery = {
  readonly where?: Record<string, unknown>;
  readonly orderBy?: readonly { readonly field: string; readonly direction: "asc" | "desc" }[];
  readonly limit?: number;
  readonly offset?: number;
  readonly first?: number;
  readonly after?: { readonly value: string };
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
  readonly queries: Array<{ readonly collection: string; readonly query: TestStorageQuery }> = [];
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
    query: TestStorageQuery,
  ): Promise<T | null> {
    return (await this.findMany<T>(collection, query))[0] ?? null;
  }

  async findMany<T>(
    collection: string,
    query: TestStorageQuery = {},
  ): Promise<readonly T[]> {
    this.queries.push({ collection, query: structuredClone(query) });
    let rows = [...(this.collections.get(collection)?.values() ?? [])]
      .filter((record) => matchesWhere(record, query.where));
    for (const order of [...(query.orderBy ?? [])].reverse()) {
      rows.sort((left, right) => {
        const compared = compare(getPath(left, order.field), getPath(right, order.field));
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
    query: TestStorageQuery & { readonly first: number },
  ) {
    this.queries.push({ collection, query: structuredClone(query) });
    const requestedOrder = query.orderBy ?? [{ field: "id", direction: "asc" as const }];
    const orderBy = requestedOrder.some(({ field }) => field === "id")
      ? requestedOrder
      : [...requestedOrder, { field: "id", direction: "asc" as const }];
    let rows = [...(this.collections.get(collection)?.values() ?? [])]
      .filter((record) => matchesWhere(record, query.where));
    rows.sort((left, right) => {
      for (const order of orderBy) {
        const compared = compare(getPath(left, order.field), getPath(right, order.field));
        if (compared) return order.direction === "asc" ? compared : -compared;
      }
      return 0;
    });
    if (query.after) {
      const cursor = JSON.parse(decodeURIComponent(query.after.value)) as unknown[];
      rows = rows.filter((record) => {
        for (const [index, order] of orderBy.entries()) {
          const compared = compare(getPath(record, order.field), cursor[index]);
          if (compared) return order.direction === "asc" ? compared > 0 : compared < 0;
        }
        return false;
      });
    }
    const items = rows.slice(0, query.first);
    const hasNextPage = rows.length > query.first;
    const nextCursor = hasNextPage
      ? {
          value: encodeURIComponent(JSON.stringify(
            orderBy.map((order) => getPath(items.at(-1)!, order.field)),
          )),
        }
      : null;
    return {
      items: structuredClone(items) as T[],
      hasNextPage,
      nextCursor,
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

class WebhookLookupStorage extends MemoryStorage {
  readonly webhookLookups: Array<{
    readonly collection: string;
    readonly where?: Record<string, unknown>;
  }> = [];

  override async findOne<T>(
    collection: string,
    query: TestStorageQuery,
  ): Promise<T | null> {
    if (collection.startsWith("cms_webhook_") || collection === "cms_change_events") {
      this.webhookLookups.push({ collection, where: query.where });
    }
    return super.findOne<T>(collection, query);
  }
}

const matchesWhere = (
  record: Record<string, unknown>,
  where: Record<string, unknown> | undefined,
): boolean => {
  if (!where) return true;
  const and = where.and;
  if (Array.isArray(and) && !and.every((item) =>
    matchesWhere(record, item as Record<string, unknown>),
  )) return false;
  const or = where.or;
  if (Array.isArray(or) && or.length > 0 && !or.some((item) =>
    matchesWhere(record, item as Record<string, unknown>),
  )) return false;
  return Object.entries(where).every(([field, comparison]) => {
    if (field === "and" || field === "or") return true;
    const operation = comparison as { operator: string; value: unknown };
    const value = getPath(record, field);
    switch (operation.operator) {
      case "eq": return JSON.stringify(value) === JSON.stringify(operation.value);
      case "ne": return JSON.stringify(value) !== JSON.stringify(operation.value);
      case "contains":
        return typeof value === "string"
          ? value.toLocaleLowerCase().includes(String(operation.value).toLocaleLowerCase())
          : Array.isArray(value) && value.some((item) =>
              JSON.stringify(item) === JSON.stringify(operation.value),
            );
      case "in": return (operation.value as unknown[]).some((item) =>
        JSON.stringify(item) === JSON.stringify(value),
      );
      case "notIn": return !(operation.value as unknown[]).some((item) =>
        JSON.stringify(item) === JSON.stringify(value),
      );
      case "exists": return Boolean(operation.value) === (value !== undefined);
      case "gt": return compare(value, operation.value) > 0;
      case "gte": return compare(value, operation.value) >= 0;
      case "lt": return compare(value, operation.value) < 0;
      case "lte": return compare(value, operation.value) <= 0;
      default: return false;
    }
  });
};

const getPath = (
  record: Record<string, unknown>,
  path: string,
): unknown =>
  path.split(".").reduce<unknown>((value, segment) =>
    typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)[segment]
      : undefined,
  record,
  );

const hasWhereComparison = (
  where: Record<string, unknown> | undefined,
  field: string,
  operator: string,
  value: unknown,
): boolean => {
  if (!where) return false;
  const comparison = where[field] as { operator?: string; value?: unknown } | undefined;
  if (
    comparison?.operator === operator &&
    JSON.stringify(comparison.value) === JSON.stringify(value)
  ) {
    return true;
  }
  return ["and", "or"].some((key) => {
    const children = where[key];
    return Array.isArray(children) && children.some((child) =>
      hasWhereComparison(child as Record<string, unknown>, field, operator, value),
    );
  });
};

const compare = (left: unknown, right: unknown): number => {
  const normalize = (value: unknown): unknown => {
    if (value instanceof Date) return value.getTime();
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(value) &&
      Number.isFinite(Date.parse(value))
    ) {
      return Date.parse(value);
    }
    return value;
  };
  const leftValue = normalize(left);
  const rightValue = normalize(right);
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

  it("validates the new code-first runtime field kinds recursively", async () => {
    let computeCalls = 0;
    const definition = {
      slug: "code-first",
      name: "Code first",
      version: 1,
      fields: [
        {
          key: "email",
          type: "email",
          label: "Email",
          required: true,
        },
        {
          key: "website",
          type: "url",
          label: "Website",
          validation: { minLength: 8 },
        },
        {
          key: "tags",
          type: "array",
          label: "Tags",
          of: {
            key: "item",
            type: "text",
            label: "Item",
            required: true,
          },
        },
        {
          key: "profile",
          type: "object",
          label: "Profile",
          fields: [
            {
              key: "displayName",
              type: "text",
              label: "Display name",
              required: true,
              defaultValue: "Guest",
            },
          ],
        },
        {
          key: "score",
          type: "custom",
          label: "Score",
          name: "finite-score",
          required: true,
          is: (value: unknown): value is number =>
            typeof value === "number" && Number.isFinite(value),
          validate: (value: unknown) =>
            typeof value === "number" && value < 0
              ? "Score must not be negative."
              : undefined,
        },
        {
          key: "summary",
          type: "computed",
          label: "Summary",
          compute: () => {
            computeCalls += 1;
            return "computed";
          },
        },
      ],
    } as unknown as ContentTypeDefinition;

    validateContentTypeDefinition(definition);
    const normalized = await validateContentFields(
      definition,
      {
        email: "author@example.com",
        website: "https://example.com",
        tags: ["cms"],
        profile: {},
        score: 1,
      },
      { tenantId, contentTypeSlug: "code-first", locale: "en-US", actor },
    );
    expect(normalized.profile).toEqual({ displayName: "Guest" });
    expect(normalized.tags).toEqual(["cms"]);
    expect(computeCalls).toBe(0);

    const error = await validateContentFields(
      definition,
      {
        email: "invalid",
        website: "javascript:alert(1)",
        tags: [5],
        profile: { unexpected: "value" },
        score: -1,
        summary: "forged",
      },
      { tenantId, contentTypeSlug: "code-first", locale: "en-US", actor },
    ).then(
      () => null,
      (reason: unknown) => reason,
    );
    expect(error).toBeInstanceOf(CmsValidationError);
    const issues = (error as CmsValidationError).issues;
    expect(issues.map(({ path, code }) => [path, code])).toEqual(
      expect.arrayContaining([
        ["email", "email"],
        ["website", "url"],
        ["tags[0]", "type"],
        ["profile.unexpected", "unknown-field"],
        ["summary", "read-only"],
        ["score", "custom-validation"],
      ]),
    );
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
    const { cms, storage } = createCms();
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
    const publicPage = await cms.listEntries({
      tenantId,
      actor: null,
      contentType: "article",
      first: 10,
      visibility: "public",
      filters: [{ field: "title", operator: "eq", value: "First title" }],
    });
    expect(publicPage.items).toHaveLength(1);
    expect(publicPage.items[0]?.fields.title).toBe("First title");
    const publicQuery = storage.queries
      .filter(({ collection, query }) =>
        collection === "cms_content_entries" && query.first !== undefined,
      )
      .at(-1)?.query;
    expect(hasWhereComparison(
      publicQuery?.where,
      "publishedSnapshot.fields.title",
      "eq",
      "First title",
    )).toBe(true);
    expect(hasWhereComparison(
      publicQuery?.where,
      "fields.title",
      "eq",
      "First title",
    )).toBe(false);
    expect(hasWhereComparison(
      publicQuery?.where,
      "status",
      "ne",
      "archived",
    )).toBe(true);
    const publicStatusPage = await cms.listEntries({
      tenantId,
      actor: null,
      contentType: "article",
      first: 10,
      visibility: "public",
      where: [{ field: "status", operator: "equals", value: "published" }],
    } as never);
    expect(publicStatusPage.items).toHaveLength(1);
    const draftStatusPage = await cms.listEntries({
      tenantId,
      actor: null,
      contentType: "article",
      first: 10,
      visibility: "public",
      where: [{ field: "status", operator: "equals", value: "draft" }],
    } as never);
    expect(draftStatusPage.items).toHaveLength(0);

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

  it("rebinds runtime field callbacks without persisting them and keeps computed snapshots immutable", async () => {
    const { cms, storage } = createCms();
    const definition = {
      slug: "runtime-fields",
      name: "Runtime fields",
      version: 1,
      fields: [
        {
          key: "title",
          type: "text",
          label: "Title",
          required: true,
          validate: (value: unknown) =>
            value === "forbidden" ? "This title is reserved." : undefined,
        },
        {
          key: "privateNote",
          type: "text",
          label: "Private note",
          access: {
            read: false,
            write: async ({ operation }: { readonly operation: string }) =>
              operation === "write",
          },
        },
        {
          key: "profile",
          type: "object",
          label: "Profile",
          fields: [
            { key: "name", type: "text", label: "Name", required: true },
          ],
        },
        {
          key: "summary",
          type: "computed",
          label: "Summary",
          compute: ({ fields }: { readonly fields: Record<string, unknown> }) =>
            `Summary: ${String(fields.title ?? "")}`,
        },
      ],
    } as unknown as ContentTypeDefinition;
    await cms.registerContentType({ tenantId, actor, definition });

    const storedType = [...storage.collections.get("cms_content_types")!.values()][0]!;
    const storedFields = storedType.fields as Array<Record<string, unknown>>;
    const storedSummary = storedFields.find((field) => field.key === "summary")!;
    const storedTitle = storedFields.find((field) => field.key === "title")!;
    const storedPrivateNote = storedFields.find((field) => field.key === "privateNote")!;
    expect(storedSummary).not.toHaveProperty("compute");
    expect(storedSummary.__cmsRuntimeCallbacks).toEqual(["compute"]);
    expect(storedTitle).not.toHaveProperty("validate");
    expect(storedTitle.__cmsRuntimeCallbacks).toEqual(["validate"]);
    expect(storedFields.find((field) => field.key === "privateNote")).toHaveProperty(
      "access",
      { read: false },
    );
    expect(storedPrivateNote.__cmsRuntimeCallbacks).toEqual(["access.write"]);

    const created = await cms.createEntry({
      tenantId,
      actor,
      contentType: "runtime-fields",
      locale: "en-US",
      slug: "runtime-fields",
      fields: {
        title: "First",
        privateNote: "private",
        profile: { name: "Ada" },
      },
    });
    expect(created.fields.privateNote).toBeUndefined();
    expect(created.fields.summary).toBe("Summary: First");

    const unconfiguredRestart = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => "unconfigured",
    });
    await expect(unconfiguredRestart.getEntry({
      tenantId,
      actor,
      entryId: created.id,
      visibility: "admin",
    })).rejects.toBeInstanceOf(CmsSchemaError);

    let restartId = 0;
    const restarted = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => `restart-${++restartId}`,
    });
    await restarted.registerContentType({ tenantId, actor, definition });

    const published = await restarted.publish({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: created.revision,
    });
    const edited = await restarted.saveDraft({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: published.revision,
      fields: { title: "Second" },
    });
    expect(edited.fields.summary).toBe("Summary: Second");
    const rawEntry = storage.collections.get("cms_content_entries")!.get(created.id)!;
    expect((rawEntry.fields as Record<string, unknown>).privateNote).toBe("private");

    const publicEntry = await restarted.getEntry({
      tenantId,
      actor: null,
      entryId: created.id,
      visibility: "public",
    });
    expect(publicEntry.fields.title).toBe("First");
    expect(publicEntry.fields.summary).toBe("Summary: First");
  });

  it("auto-publishes create and update when drafts are disabled", async () => {
    const { cms } = createCms({
      collectionOptions: {
        article: { drafts: false, timestamps: false },
      },
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const created = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: {
        title: "First",
        path: "first",
        category: "news",
      },
    });
    expect(created.status).toBe("published");
    expect(created.publishedSnapshot?.fields.title).toBe("First");
    const updated = await cms.saveDraft({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: created.revision,
      fields: { title: "Second", path: "second" },
    });
    expect(updated.status).toBe("published");
    expect(updated.publishedSnapshot?.fields.title).toBe("Second");
    await expect(cms.unpublish({
      tenantId,
      actor,
      entryId: created.id,
      expectedRevision: updated.revision,
    })).rejects.toBeInstanceOf(CmsCapabilityError);
  });

  it("combines collection access with global policy and invokes veto/after-change hooks", async () => {
    const { cms, storage } = createCms({
      collectionOptions: {
        article: {
          drafts: true,
          timestamps: false,
          access: {
            "entry:create": async () => true,
            "entry:update": async () => true,
            "entry:read": async () => true,
            "field:read": async () => true,
            "field:write": async () => true,
          },
        },
      },
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const operations: string[] = [];
    const scheduled: CmsScheduledPublication[] = [];
    const scheduler = {
      schedule: async (publication: CmsScheduledPublication) => {
        scheduled.push(publication);
      },
      cancel: async (publication: CmsScheduledPublication) => {
        scheduled.splice(
          scheduled.findIndex((job) => job.id === publication.id),
          1,
        );
      },
    };
    const hookService = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => `hook-${operations.length}`,
      clock: () => new Date("2026-01-01T00:00:00.000Z"),
      scheduler,
      collectionOptions: {
        article: {
          drafts: true,
          timestamps: false,
          access: {
            "entry:create": async () => true,
            "entry:update": async () => true,
            "entry:read": async () => true,
            "entry:publish": async () => true,
            "entry:schedule": async () => true,
            "entry:unschedule": async () => true,
            "field:read": async () => true,
            "field:write": async () => true,
          },
          hooks: {
            beforeChange: async (event) => {
              operations.push(`before:${event.operation}`);
              if (event.fields?.title === "veto") throw new Error("veto");
            },
            afterChange: async (event) => {
              operations.push(`after:${event.operation}`);
              if (
                event.operation === "update" &&
                event.entry.fields.title === "after-failure"
              ) {
                throw new Error("after hook failed");
              }
            },
          },
        },
      },
    });
    await hookService.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const entry = await hookService.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "First", path: "first", category: "news" },
    });
    expect(operations).toEqual(["before:create", "after:create"]);
    await expect(hookService.saveDraft({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: entry.revision,
      fields: { title: "veto" },
    })).rejects.toThrow("veto");
    expect(
      (storage.collections.get("cms_content_entries")!.get(entry.id)!.fields as Record<string, unknown>)
        .title,
    ).toBe("First");

    await expect(hookService.saveDraft({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: entry.revision,
      fields: { title: "after-failure", path: "after-failure" },
    })).rejects.toThrow("after hook failed");
    expect(
      (storage.collections.get("cms_content_entries")!.get(entry.id)!.fields as Record<string, unknown>)
        .title,
    ).toBe("after-failure");
    expect(operations.slice(-2)).toEqual(["before:update", "after:update"]);
    const current = await hookService.getEntry({
      tenantId,
      actor,
      entryId: entry.id,
      visibility: "admin",
    });
    const published = await hookService.publish({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: current.revision,
    });
    expect(operations.slice(-2)).toEqual(["before:publish", "after:publish"]);
    const scheduledEntry = await hookService.schedulePublish({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: published.revision,
      publishAt: new Date("2026-01-03T00:00:00.000Z"),
      timeZone: "UTC",
    });
    expect(scheduledEntry.status).toBe("scheduled");
    expect(operations.slice(-2)).toEqual(["before:schedule", "after:schedule"]);
    await hookService.unschedule({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: scheduledEntry.revision,
    });
    expect(operations.slice(-2)).toEqual(["before:unschedule", "after:unschedule"]);
    expect(scheduled).toHaveLength(0);

    const denied = createCms({
      accessPolicy: async (request) => request.action !== "entry:create",
      collectionOptions: {
        article: {
          drafts: true,
          timestamps: false,
          access: { "entry:create": async () => true },
        },
      },
    });
    await denied.cms.registerContentType({
      tenantId,
      actor,
      definition: baseDefinition(),
    });
    await expect(denied.cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Denied", path: "denied", category: "news" },
    })).rejects.toBeInstanceOf(CmsPermissionDeniedError);

    const restricted = createCms({
      collectionOptions: {
        article: {
          drafts: true,
          timestamps: false,
          access: {
            "entry:create": async () => true,
            "field:write": async () => true,
          },
        },
      },
    });
    await restricted.cms.registerContentType({
      tenantId,
      actor,
      definition: baseDefinition(),
    });
    const restrictedEntry = await restricted.cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Hidden", path: "hidden", category: "news" },
    });
    expect(restrictedEntry.fields.title).toBeUndefined();
    await expect(restricted.cms.listEntries({
      tenantId,
      actor,
      contentType: "article",
      first: 1,
      visibility: "admin",
    })).rejects.toBeInstanceOf(CmsPermissionDeniedError);

    const aliases: string[] = [];
    const friendlyAccess = createCms({
      collectionOptions: {
        article: {
          drafts: true,
          timestamps: false,
          access: {
            create: async ({ user, action }) => {
              aliases.push(action);
              return user?.id === actor.id && action === "create";
            },
            read: async ({ user, action }) => {
              aliases.push(action);
              return user?.id === actor.id && action === "read";
            },
            translations: async ({ user, action }) => {
              aliases.push(action);
              return user?.id === actor.id && action === "translations";
            },
          },
        },
      },
    });
    await friendlyAccess.cms.registerContentType({
      tenantId,
      actor,
      definition: baseDefinition(),
    });
    const original = await friendlyAccess.cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Original", path: "original", category: "news" },
    });
    await friendlyAccess.cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "fr-FR",
      translationGroupId: original.translationGroupId,
      fields: { title: "Originale", path: "originale", category: "news" },
    });
    const variants = await friendlyAccess.cms.listEntryTranslations({
      tenantId,
      actor,
      contentType: "article",
      translationGroupId: original.translationGroupId,
      first: 10,
      visibility: "admin",
    });
    expect(variants.items).toHaveLength(2);
    expect(aliases).toContain("create");
    expect(aliases).toContain("read");
    expect(aliases).toContain("translations");
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

  it("idempotently registers one schema from simultaneous cold service instances", async () => {
    const storage = new MemoryStorage();
    let firstId = 0;
    let secondId = 0;
    const first = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => `first-${++firstId}`,
      emitChangeEvents: true,
    });
    const second = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => `second-${++secondId}`,
      emitChangeEvents: true,
    });
    const definition = baseDefinition();
    const [left, right] = await Promise.all([
      first.registerContentType({ tenantId, actor, definition }),
      second.registerContentType({ tenantId, actor, definition }),
    ]);

    expect(left.id).toBe(right.id);
    expect(storage.collections.get("cms_content_types")?.size).toBe(1);
    expect(storage.collections.get("cms_audit_events")?.size).toBe(1);
    expect(storage.collections.get("cms_change_events")?.size).toBe(1);
    await expect(second.registerContentType({
      tenantId,
      actor,
      definition: { ...definition, name: "Incompatible same version" },
    })).rejects.toBeInstanceOf(CmsSchemaError);
  });

  it("tenant-scopes direct ID reads for entries, revisions, jobs, events, and type IDs", async () => {
    const { cms, storage } = createCms({ emitChangeEvents: true });
    const definition = baseDefinition();
    await cms.registerContentType({ tenantId, actor, definition });
    await cms.registerContentType({
      tenantId: "tenant_b",
      actor,
      definition,
    });
    const entryA = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Tenant A", path: "tenant-a", category: "news" },
    });
    const entryB = await cms.createEntry({
      tenantId: "tenant_b",
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Tenant B", path: "tenant-b", category: "news" },
    });
    const revisionA = (await cms.listRevisions({
      tenantId,
      actor,
      entryId: entryA.id,
    }))[0]!;
    const typeB = [...storage.collections.get("cms_content_types")!.values()]
      .find((record) => record.tenantId === "tenant_b")!;

    await expect(cms.getEntry({
      tenantId: "tenant_b",
      actor,
      entryId: entryA.id,
      visibility: "admin",
    })).rejects.toThrow();
    expect(storage.queries.some(({ collection, query }) =>
      collection === "cms_content_entries" &&
      hasWhereComparison(query.where, "id", "eq", entryA.id) &&
      hasWhereComparison(query.where, "tenantId", "eq", "tenant_b"),
    )).toBe(true);

    await expect(cms.restoreRevision({
      tenantId: "tenant_b",
      actor,
      entryId: entryB.id,
      expectedRevision: entryB.revision,
      revisionId: revisionA.id,
    })).rejects.toThrow();
    expect(storage.queries.some(({ collection, query }) =>
      collection === "cms_content_revisions" &&
      hasWhereComparison(query.where, "id", "eq", revisionA.id) &&
      hasWhereComparison(query.where, "tenantId", "eq", "tenant_b") &&
      hasWhereComparison(query.where, "entryId", "eq", entryB.id),
    )).toBe(true);

    const scheduled = await cms.publishScheduled({
      tenantId: "tenant_b",
      actor,
      publication: {
        id: `${entryA.id}:1`,
        tenantId: "tenant_b",
        entryId: entryA.id,
        scheduledRevisionNumber: 1,
        publishAt: new Date("2026-01-03T00:00:00.000Z"),
        timeZone: "UTC",
      },
    });
    expect(scheduled).toEqual({ published: false, reason: "stale" });
    expect(storage.queries.some(({ collection, query }) =>
      collection === "cms_content_entries" &&
      hasWhereComparison(query.where, "id", "eq", entryA.id) &&
      hasWhereComparison(query.where, "tenantId", "eq", "tenant_b"),
    )).toBe(true);

    const eventA = [...storage.collections.get("cms_change_events")!.values()]
      .find((event) => event.tenantId === tenantId)! as {
        readonly id: string;
        readonly tenantId: string;
        readonly revision: number;
      };
    await expect(cms.acknowledgeChangeEvent({
      tenantId: "tenant_b",
      actor,
      eventId: eventA.id,
      expectedRevision: eventA.revision,
    })).rejects.toThrow();
    expect(storage.queries.some(({ collection, query }) =>
      collection === "cms_change_events" &&
      hasWhereComparison(query.where, "id", "eq", eventA.id) &&
      hasWhereComparison(query.where, "tenantId", "eq", "tenant_b"),
    )).toBe(true);

    await cms.getEntry({
      tenantId: "tenant_b",
      actor,
      entryId: entryB.id,
      visibility: "admin",
    });
    expect(storage.queries.some(({ collection, query }) =>
      collection === "cms_content_types" &&
      hasWhereComparison(query.where, "id", "eq", typeB.id) &&
      hasWhereComparison(query.where, "tenantId", "eq", "tenant_b"),
    )).toBe(true);
  });

  it("supports simultaneous cold code-first request instances sharing Storage", async () => {
    const config = defineCMS({
      collections: {
        articles: collection({
          fields: {
            title: fields.text({ required: true }),
            slug: fields.slug({ from: "title" }),
          },
        }),
      },
    });
    const storage = new MemoryStorage();
    let firstId = 0;
    let secondId = 0;
    const firstOptions = {
      config,
      storage: storage as never,
      context: { tenantId, actor },
      accessPolicy: async () => true,
      idGenerator: () => `first-request-${++firstId}`,
    };
    const secondOptions = {
      config,
      storage: storage as never,
      context: { tenantId, actor },
      accessPolicy: async () => true,
      idGenerator: () => `second-request-${++secondId}`,
    };
    const first = createTypedCms(firstOptions);
    const second = createTypedCms(secondOptions);
    const [left, right] = await Promise.all([
      first.articles.create({ title: "First request" }),
      second.articles.create({ title: "Second request" }),
    ]);

    expect(left.status).toBe("published");
    expect(right.status).toBe("published");
    expect(storage.collections.get("cms_content_types")?.size).toBe(1);
    expect(storage.collections.get("cms_content_entries")?.size).toBe(2);
    expect(
      [...storage.collections.get("cms_audit_events")!.values()].filter((event) =>
        event.resource === "contentType" && event.action === "content-type:create",
      ),
    ).toHaveLength(1);
  });

  it("purges unreferenced entries with relationship schemas and preserves media usage atomically", async () => {
    const { cms, storage } = createCms({
      emitChangeEvents: true,
      mediaReferenceValidator: {
        assertCanReference: async ({ tenantId: scope, assetId }) => {
          if (
            scope !== tenantId ||
            !["asset_1", "asset_2"].includes(assetId)
          ) {
            throw new Error("not found");
          }
        },
      },
    });
    const authorDefinition: ContentTypeDefinition = {
      slug: "author",
      name: "Author",
      version: 1,
      fields: [
        { key: "name", type: "text", label: "Name", required: true },
        { key: "cover", type: "media", label: "Cover" },
      ],
    };
    const storyDefinition: ContentTypeDefinition = {
      slug: "story",
      name: "Story",
      version: 1,
      fields: [
        { key: "title", type: "text", label: "Title", required: true },
        {
          key: "author",
          type: "relationship",
          label: "Author",
          relation: { targetTypes: ["author"] },
        },
      ],
    };
    const mediaHolderDefinition: ContentTypeDefinition = {
      slug: "media-holder",
      name: "Media holder",
      version: 1,
      fields: [
        { key: "name", type: "text", label: "Name", required: true },
        { key: "cover", type: "media", label: "Cover" },
      ],
    };
    await cms.registerContentType({ tenantId, actor, definition: authorDefinition });
    await cms.registerContentType({ tenantId, actor, definition: storyDefinition });
    await cms.registerContentType({ tenantId, actor, definition: mediaHolderDefinition });
    const referencedAuthor = await cms.createEntry({
      tenantId,
      actor,
      contentType: "author",
      locale: "en-US",
      slug: "referenced",
      fields: { name: "Referenced", cover: "asset_1" },
    });
    const purgeableAuthor = await cms.createEntry({
      tenantId,
      actor,
      contentType: "author",
      locale: "en-US",
      slug: "purgeable",
      fields: { name: "Purgeable", cover: "asset_2" },
    });
    const unreferencedAuthor = await cms.createEntry({
      tenantId,
      actor,
      contentType: "author",
      locale: "en-US",
      slug: "unreferenced",
      fields: { name: "Unreferenced" },
    });
    const purgeableMediaEntry = await cms.createEntry({
      tenantId,
      actor,
      contentType: "media-holder",
      locale: "en-US",
      slug: "purgeable-media",
      fields: { name: "Purgeable media entry", cover: "asset_2" },
    });
    const draftReferencedAuthor = await cms.createEntry({
      tenantId,
      actor,
      contentType: "author",
      locale: "en-US",
      slug: "draft-referenced",
      fields: { name: "Draft referenced", cover: "asset_1" },
    });
    const alternativeAuthor = await cms.createEntry({
      tenantId,
      actor,
      contentType: "author",
      locale: "en-US",
      slug: "alternative",
      fields: { name: "Alternative" },
    });
    const publishedStory = await cms.createEntry({
      tenantId,
      actor,
      contentType: "story",
      locale: "en-US",
      slug: "story",
      fields: { title: "Referenced story", author: referencedAuthor.id },
    });
    const published = await cms.publish({
      tenantId,
      actor,
      entryId: publishedStory.id,
      expectedRevision: publishedStory.revision,
    });
    await cms.saveDraft({
      tenantId,
      actor,
      entryId: publishedStory.id,
      expectedRevision: published.revision,
      fields: { author: alternativeAuthor.id },
    });
    await cms.createEntry({
      tenantId,
      actor,
      contentType: "story",
      locale: "en-US",
      slug: "draft-story",
      fields: { title: "Draft reference", author: draftReferencedAuthor.id },
    });
    const sharedAssetUsagesBefore = await cms.listMediaUsages({
      tenantId,
      actor,
      assetId: "asset_1",
    });

    await expect(cms.purgeEntry({
      tenantId,
      actor,
      entryId: referencedAuthor.id,
      expectedRevision: referencedAuthor.revision,
    })).rejects.toBeInstanceOf(CmsConflictError);
    await expect(cms.purgeEntry({
      tenantId,
      actor,
      entryId: draftReferencedAuthor.id,
      expectedRevision: draftReferencedAuthor.revision,
    })).rejects.toBeInstanceOf(CmsConflictError);
    const storyRecords = [...storage.collections.get("cms_content_entries")!.values()]
      .filter((record) => record.contentTypeSlug === "story");
    expect(storyRecords.every((record) => {
      const currentFields = record.fields as Record<string, unknown>;
      const snapshot = record.publishedSnapshot as {
        readonly fields?: Record<string, unknown>;
      } | null;
      return currentFields.author !== purgeableAuthor.id &&
        snapshot?.fields?.author !== purgeableAuthor.id;
    })).toBe(true);
    await cms.purgeEntry({
      tenantId,
      actor,
      entryId: unreferencedAuthor.id,
      expectedRevision: unreferencedAuthor.revision,
    });
    expect(storage.collections.get("cms_content_entries")!.has(unreferencedAuthor.id)).toBe(false);
    expect(storage.collections.get("cms_content_entries")!.has(purgeableAuthor.id)).toBe(true);
    expect(storage.collections.get("cms_content_entries")!.has(referencedAuthor.id)).toBe(true);

    const revisionsBefore = storage.collections.get("cms_content_revisions")!.size;
    const usagesBefore = storage.collections.get("cms_media_usages")!.size;
    const eventsBefore = storage.collections.get("cms_change_events")!.size;
    await expect(cms.purgeEntry({
      tenantId,
      actor,
      entryId: purgeableMediaEntry.id,
      expectedRevision: purgeableMediaEntry.revision + 1,
    })).rejects.toBeInstanceOf(CmsConflictError);
    storage.capabilities = { ...storage.capabilities, atomicBatch: false };
    await expect(cms.purgeEntry({
      tenantId,
      actor,
      entryId: purgeableMediaEntry.id,
      expectedRevision: purgeableMediaEntry.revision,
    })).rejects.toBeInstanceOf(CmsCapabilityError);
    expect(storage.collections.get("cms_content_entries")!.has(purgeableMediaEntry.id)).toBe(true);
    storage.capabilities = { ...storage.capabilities, atomicBatch: true };
    storage.failChangeEventInsert = true;
    await expect(cms.purgeEntry({
      tenantId,
      actor,
      entryId: purgeableMediaEntry.id,
      expectedRevision: purgeableMediaEntry.revision,
    })).rejects.toThrow("Change event storage failed");
    expect(storage.collections.get("cms_content_entries")!.has(purgeableMediaEntry.id)).toBe(true);
    expect(storage.collections.get("cms_content_revisions")!.size).toBe(revisionsBefore);
    expect(storage.collections.get("cms_media_usages")!.size).toBe(usagesBefore);
    expect(storage.collections.get("cms_change_events")!.size).toBe(eventsBefore);

    storage.failChangeEventInsert = false;
    await cms.purgeEntry({
      tenantId,
      actor,
      entryId: purgeableMediaEntry.id,
      expectedRevision: purgeableMediaEntry.revision,
      changeSummary: "Data erasure",
    });
    expect(storage.collections.get("cms_content_entries")!.has(purgeableMediaEntry.id)).toBe(false);
    const purgeRevisions = [...storage.collections.get("cms_content_revisions")!.values()]
      .filter((revision) => revision.entryId === purgeableMediaEntry.id);
    expect(purgeRevisions).toHaveLength(1);
    expect(purgeRevisions[0]).toMatchObject({
      action: "delete",
      fields: {},
      changeSummary: "Data erasure",
    });
    expect((await cms.listMediaUsages({ tenantId, actor, assetId: "asset_2" }))).toHaveLength(1);
    expect(await cms.listMediaUsages({
      tenantId,
      actor,
      assetId: "asset_1",
    })).toHaveLength(sharedAssetUsagesBefore.length);
    expect(storage.collections.get("cms_audit_events")!.size).toBeGreaterThan(0);
    expect(storage.collections.get("cms_change_events")!.size).toBe(eventsBefore + 1);
    const purgeEvent = [...storage.collections.get("cms_change_events")!.values()].find(
      (event) => event.resourceId === purgeableMediaEntry.id && event.action === "entry:delete",
    );
    expect(purgeEvent?.tenantId).toBe(tenantId);
  });

  it("prevents a concurrent relationship write from racing permanent deletion", async () => {
    const { cms, storage } = createCms();
    const authorDefinition: ContentTypeDefinition = {
      slug: "author",
      name: "Author",
      version: 1,
      fields: [{ key: "name", type: "text", label: "Name", required: true }],
    };
    const storyDefinition: ContentTypeDefinition = {
      slug: "story",
      name: "Story",
      version: 1,
      fields: [
        { key: "title", type: "text", label: "Title", required: true },
        {
          key: "author",
          type: "relationship",
          label: "Author",
          relation: { targetTypes: ["author"] },
        },
      ],
    };
    await cms.registerContentType({ tenantId, actor, definition: authorDefinition });
    await cms.registerContentType({ tenantId, actor, definition: storyDefinition });
    const author = await cms.createEntry({
      tenantId,
      actor,
      contentType: "author",
      locale: "en-US",
      slug: "racing-author",
      fields: { name: "Racing author" },
    });

    let markRelationshipWriteReady!: () => void;
    const relationshipWriteReady = new Promise<void>((resolve) => {
      markRelationshipWriteReady = resolve;
    });
    let releaseRelationshipWrite!: () => void;
    const relationshipWriteGate = new Promise<void>((resolve) => {
      releaseRelationshipWrite = resolve;
    });
    const originalAtomicBatch = storage.atomicBatch.bind(storage);
    storage.atomicBatch = async (operations) => {
      const updatesRelationshipGuard = operations.some((operation) =>
        operation.type === "update" &&
        operation.collection === "cms_relationship_locks",
      );
      if (updatesRelationshipGuard) {
        markRelationshipWriteReady();
        await relationshipWriteGate;
      }
      return originalAtomicBatch(operations);
    };

    const pendingStory = cms.createEntry({
      tenantId,
      actor,
      contentType: "story",
      locale: "en-US",
      slug: "racing-story",
      fields: { title: "Racing story", author: author.id },
    });
    try {
      await Promise.race([
        relationshipWriteReady,
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Relationship write did not reach its guard batch.")), 1000);
        }),
      ]);
      await cms.purgeEntry({
        tenantId,
        actor,
        entryId: author.id,
        expectedRevision: author.revision,
      });
    } finally {
      releaseRelationshipWrite();
    }

    await expect(pendingStory).rejects.toBeInstanceOf(CmsConflictError);
    expect(storage.collections.get("cms_content_entries")!.has(author.id)).toBe(false);
    expect(
      [...storage.collections.get("cms_content_entries")!.values()]
        .some((entry) => entry.contentTypeSlug === "story"),
    ).toBe(false);
  });

  it("fails closed when purging scheduled entries and restores cancelled jobs after batch failure", async () => {
    const storage = new MemoryStorage();
    const jobs: CmsScheduledPublication[] = [];
    let failCancel = false;
    let nextId = 0;
    const scheduler = {
      schedule: async (publication: CmsScheduledPublication) => {
        jobs.push(publication);
      },
      cancel: async (publication: CmsScheduledPublication) => {
        if (failCancel) throw new Error("cancel failed");
        const index = jobs.findIndex((job) => job.id === publication.id);
        if (index >= 0) jobs.splice(index, 1);
      },
    };
    const cms = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      scheduler,
      emitChangeEvents: true,
      clock: () => new Date("2026-01-01T00:00:00.000Z"),
      idGenerator: () => `purge-scheduled-${++nextId}`,
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const entry = await cms.createEntry({
      tenantId,
      actor,
      contentType: "article",
      locale: "en-US",
      fields: { title: "Scheduled", path: "scheduled", category: "news" },
    });
    const scheduled = await cms.schedulePublish({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: entry.revision,
      publishAt: new Date("2026-01-03T00:00:00.000Z"),
      timeZone: "UTC",
    });
    expect(jobs).toHaveLength(1);

    const withoutScheduler = new CmsService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => "no-scheduler",
    });
    await expect(withoutScheduler.purgeEntry({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: scheduled.revision,
    })).rejects.toBeInstanceOf(CmsCapabilityError);
    expect(storage.collections.get("cms_content_entries")!.has(entry.id)).toBe(true);

    failCancel = true;
    await expect(cms.purgeEntry({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: scheduled.revision,
    })).rejects.toBeInstanceOf(CmsSchedulerError);
    expect(jobs).toHaveLength(1);
    failCancel = false;

    storage.failChangeEventInsert = true;
    await expect(cms.purgeEntry({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: scheduled.revision,
    })).rejects.toThrow("Change event storage failed");
    expect(storage.collections.get("cms_content_entries")!.has(entry.id)).toBe(true);
    expect(jobs).toHaveLength(1);

    storage.failChangeEventInsert = false;
    await cms.purgeEntry({
      tenantId,
      actor,
      entryId: entry.id,
      expectedRevision: scheduled.revision,
    });
    expect(storage.collections.get("cms_content_entries")!.has(entry.id)).toBe(false);
    expect(jobs).toHaveLength(0);
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
    const { cms, storage } = createCms();
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
    const translations = await cms.listEntryTranslations({
      tenantId,
      actor,
      contentType: "article",
      translationGroupId: english.translationGroupId,
      first: 10,
      visibility: "admin",
    });
    expect(translations.items.map(({ locale }) => locale).sort()).toEqual([
      "en-US",
      "fr-FR",
    ]);
    const translationQuery = storage.queries
      .filter(({ collection, query }) =>
        collection === "cms_content_entries" && query.first === 11,
      )
      .at(-1)?.query;
    expect(hasWhereComparison(
      translationQuery?.where,
      "translationGroupId",
      "eq",
      english.translationGroupId,
    )).toBe(true);
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
    const slugLookupQuery = storage.queries.find(({ collection, query }) =>
      collection === "cms_content_entries" &&
      hasWhereComparison(query.where, "slug", "eq", "hello-world") &&
      hasWhereComparison(query.where, "locale", "eq", "en-US"),
    )?.query;
    expect(hasWhereComparison(slugLookupQuery?.where, "tenantId", "eq", tenantId)).toBe(true);
    expect(hasWhereComparison(slugLookupQuery?.where, "contentTypeId", "eq", "test-1")).toBe(true);
    expect(hasWhereComparison(slugLookupQuery?.where, "locale", "eq", "en-US")).toBe(true);
    expect(hasWhereComparison(slugLookupQuery?.where, "deletedAt", "eq", null)).toBe(true);
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
    const storagePageQuery = storage.queries
      .filter(({ collection, query }) =>
        collection === "cms_content_entries" && query.first === 2,
      )
      .at(-1)?.query;
    expect(storagePageQuery?.first).toBe(2);
    expect(storagePageQuery?.orderBy).toEqual([
      { field: "updatedAt", direction: "desc" },
    ]);
    expect(hasWhereComparison(storagePageQuery?.where, "tenantId", "eq", tenantId)).toBe(true);
    expect(hasWhereComparison(storagePageQuery?.where, "contentTypeId", "eq", "test-1")).toBe(true);
    expect(hasWhereComparison(storagePageQuery?.where, "locale", "eq", "en-US")).toBe(true);
    expect(hasWhereComparison(storagePageQuery?.where, "deletedAt", "eq", null)).toBe(true);
    expect(hasWhereComparison(storagePageQuery?.where, "fields.category", "eq", "news")).toBe(true);
    expect(hasWhereComparison(storagePageQuery?.where, "fields.title", "contains", "hello")).toBe(true);
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
    expect(storage.queries.at(-1)?.query.after).toBeDefined();
  });

  it("pushes recursive nested-object filters and ordering to Storage and rejects non-schema paths", async () => {
    const { cms, storage } = createCms();
    const definition = {
      slug: "nested",
      name: "Nested",
      version: 1,
      fields: [
        {
          key: "profile",
          type: "object",
          label: "Profile",
          fields: [
            { key: "name", type: "text", label: "Name", required: true },
          ],
        },
        {
          key: "tags",
          type: "array",
          label: "Tags",
          of: { key: "item", type: "text", label: "Tag", required: true },
        },
      ],
    } as unknown as ContentTypeDefinition;
    await cms.registerContentType({ tenantId, actor, definition });
    const ada = await cms.createEntry({
      tenantId,
      actor,
      contentType: "nested",
      locale: "en-US",
      slug: "ada",
      fields: { profile: { name: "Ada" }, tags: ["cms", "authoring"] },
    });
    await cms.createEntry({
      tenantId,
      actor,
      contentType: "nested",
      locale: "en-US",
      slug: "grace",
      fields: { profile: { name: "Grace" }, tags: ["compiler"] },
    });

    const page = await cms.listEntries({
      tenantId,
      actor,
      contentType: "nested",
      first: 1,
      visibility: "admin",
      where: [{
        or: [
          { field: "profile.name", operator: "equals", value: "Ada" },
          { field: "tags", operator: "contains", value: "missing" },
        ],
      }],
      orderBy: [{ field: "profile.name", direction: "asc" }],
    } as never);
    expect(page.items.map(({ id }) => id)).toEqual([ada.id]);
    const query = storage.queries
      .filter(({ collection, query }) =>
        collection === "cms_content_entries" && query.first === 2,
      )
      .at(-1)?.query;
    expect(hasWhereComparison(
      query?.where,
      "fields.profile.name",
      "eq",
      "Ada",
    )).toBe(true);
    expect(hasWhereComparison(
      query?.where,
      "fields.tags",
      "contains",
      "missing",
    )).toBe(true);
    expect(query?.orderBy).toEqual([
      { field: "fields.profile.name", direction: "asc" },
    ]);

    const pageQueriesBeforeInvalidPath = storage.queries.filter(({ collection, query }) =>
      collection === "cms_content_entries" && query.first !== undefined,
    ).length;
    await expect(cms.listEntries({
      tenantId,
      actor,
      contentType: "nested",
      first: 1,
      visibility: "admin",
      filters: [{ field: "tags", operator: "eq", value: "cms" }],
    })).rejects.toBeInstanceOf(CmsValidationError);
    await expect(cms.listEntries({
      tenantId,
      actor,
      contentType: "nested",
      first: 1,
      visibility: "admin",
      filters: [{ field: "tags.item", operator: "eq", value: "cms" }],
    })).rejects.toBeInstanceOf(CmsValidationError);
    expect(storage.queries.filter(({ collection, query }) =>
      collection === "cms_content_entries" && query.first !== undefined,
    )).toHaveLength(pageQueriesBeforeInvalidPath);
  });

  it("validates relation and media references and keeps scopes tenant-bound", async () => {
    const { cms, storage } = createCms({
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
    expect(storage.queries.some(({ collection, query }) =>
      collection === "cms_content_entries" &&
      hasWhereComparison(query.where, "id", "eq", authorEntry.id) &&
      hasWhereComparison(query.where, "tenantId", "eq", tenantId),
    )).toBe(true);
    const draftUsages = await cms.listMediaUsages({
      tenantId,
      actor,
      assetId: "asset_1",
    });
    expect(draftUsages.map((usage) => usage.usageType)).toEqual(["draft"]);
    expect(storage.queries.some(({ collection, query }) =>
      collection === "cms_content_types" &&
      hasWhereComparison(query.where, "id", "eq", story.contentTypeId) &&
      hasWhereComparison(query.where, "tenantId", "eq", tenantId),
    )).toBe(true);
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

  it("validates malformed webhook input and requires an explicit host transport", async () => {
    expect(() => new CmsWebhookService({
      storage: new MemoryStorage() as never,
      accessPolicy: async () => true,
      resolveSecret: async () => new Uint8Array(32),
    } as never)).toThrow("safe transport");

    const storage = new MemoryStorage();
    const hooks = new CmsWebhookService({
      storage: storage as never,
      accessPolicy: async () => true,
      resolveSecret: async () => new Uint8Array(32),
      transport: { send: async () => ({ status: 204 }) },
    });
    const input = {
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["entry:publish"] as const, enabled: true, secretRef: "vault/current",
    };

    await expect(hooks.createSubscription({ ...input, endpoint: 42 as never }))
      .rejects.toBeInstanceOf(CmsValidationError);
    await expect(hooks.createSubscription({
      ...input, endpoint: "https://hooks.example.test/events\nx: injected",
    })).rejects.toBeInstanceOf(CmsValidationError);
    await expect(hooks.createSubscription({ ...input, secretRef: " " }))
      .rejects.toBeInstanceOf(CmsValidationError);
    await expect(hooks.createSubscription(null as never))
      .rejects.toBeInstanceOf(CmsValidationError);
    await expect(hooks.fanout({
      tenantId, actor, eventId: " ", expectedRevision: 1,
    })).rejects.toBeInstanceOf(CmsValidationError);
  });

  it("keeps every webhook lookup tenant-scoped and hides other tenants' resources", async () => {
    let id = 0;
    const storage = new WebhookLookupStorage();
    const hooks = new CmsWebhookService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => `scoped-${++id}`,
      resolveSecret: async () => new Uint8Array(32).fill(9),
      transport: { send: async () => ({ status: 204 }) },
    });
    const subscription = await hooks.createSubscription({
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["entry:publish"], enabled: true, secretRef: "vault/current",
    });
    const eventId = "event-for-tenant-a";
    await storage.insert("cms_change_events", {
      id: eventId, tenantId, resource: "entry", resourceId: "entry-1",
      action: "entry:publish", occurredAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"), revision: 1,
    });

    await expect(hooks.fanout({
      tenantId: "tenant_b", actor, eventId, expectedRevision: 1,
    })).rejects.toThrow("not found");
    expect(await hooks.fanout({ tenantId, actor, eventId, expectedRevision: 1 })).toBe(1);
    expect(await hooks.runNext({ tenantId: "tenant_b", actor })).toBeNull();
    const delivered = await hooks.runNext({ tenantId, actor });
    expect(delivered?.status).toBe("delivered");

    await expect(hooks.getSubscription({
      tenantId: "tenant_b", actor, subscriptionId: subscription.id,
    })).rejects.toThrow("not found");
    await expect(hooks.updateSubscription({
      tenantId: "tenant_b", actor, subscriptionId: subscription.id,
      expectedRevision: subscription.revision, endpoint: "https://other.example.test/hook",
      events: ["entry:publish"], enabled: true, secretRef: "attacker/ref",
    })).rejects.toThrow("not found");
    await expect(hooks.listDeliveries({
      tenantId: "tenant_b", actor, subscriptionId: subscription.id,
    })).rejects.toThrow("not found");
    await expect(hooks.listAttempts({
      tenantId: "tenant_b", actor, deliveryId: delivered!.id,
    })).rejects.toThrow("not found");
    await expect(hooks.retryDelivery({
      tenantId: "tenant_b", actor, deliveryId: delivered!.id, expectedRevision: delivered!.revision,
    })).rejects.toThrow("not found");

    expect(storage.webhookLookups.length).toBeGreaterThan(0);
    expect(storage.webhookLookups.every(({ where }) => {
      const tenant = where?.tenantId as { readonly operator?: string; readonly value?: unknown } | undefined;
      return tenant?.operator === "eq" && typeof tenant.value === "string";
    })).toBe(true);
    expect(storage.webhookLookups.some(({ collection, where }) =>
      collection === "cms_change_events" &&
      (where?.tenantId as { readonly value?: unknown } | undefined)?.value === "tenant_b",
    )).toBe(true);
    expect(storage.webhookLookups.some(({ collection, where }) =>
      collection === "cms_webhook_subscriptions" &&
      (where?.tenantId as { readonly value?: unknown } | undefined)?.value === "tenant_b",
    )).toBe(true);
  });

  it("does not leak secret references into delivery payloads or history", async () => {
    let id = 0;
    let now = new Date("2026-01-01T00:00:00.000Z");
    const { cms, storage } = createCms({ emitChangeEvents: true }, () => now);
    const secretRef = "vault/private-webhook-ref";
    const secret = new Uint8Array(32).fill(83);
    const requests: Array<{ endpoint: string; body: Uint8Array; signature: string }> = [];
    const hooks = new CmsWebhookService({
      storage: storage as never,
      accessPolicy: async () => true,
      clock: () => now,
      idGenerator: () => `private-${++id}`,
      resolveSecret: async ({ secretRef: requestedRef }) => {
        expect(requestedRef).toBe(secretRef);
        return secret;
      },
      transport: {
        async send({ endpoint, body, signature }) {
          requests.push({ endpoint, body, signature });
          return { status: 204 };
        },
      },
    });
    const subscription = await hooks.createSubscription({
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["content-type:create"], enabled: true, secretRef,
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const event = (await cms.listChangeEvents({ tenantId, actor })).items[0]!;
    await hooks.fanout({ tenantId, actor, eventId: event.id, expectedRevision: event.revision });
    const delivery = await hooks.runNext({ tenantId, actor });
    const attempts = await hooks.listAttempts({
      tenantId, actor, deliveryId: delivery!.id,
    });
    const payload = new TextDecoder().decode(requests[0]!.body);
    const exposed = JSON.stringify({ delivery, attempts, requests: requests.map((request) => ({
      endpoint: request.endpoint, body: payload, signature: request.signature,
    })) });
    expect(payload).not.toContain(secretRef);
    expect(exposed).not.toContain(secretRef);
    expect(exposed).not.toContain(Array.from(secret).join(","));
    expect(delivery).not.toHaveProperty("secretRef");
    expect(attempts[0]).not.toHaveProperty("secretRef");
    expect((await hooks.getSubscription({ tenantId, actor, subscriptionId: subscription.id })).secretRef)
      .toBe(secretRef);
  });

  it("sanitizes secret resolver failures before recording or returning delivery status", async () => {
    let id = 0;
    const { cms, storage } = createCms({ emitChangeEvents: true });
    let transportCalled = false;
    const hooks = new CmsWebhookService({
      storage: storage as never,
      accessPolicy: async () => true,
      idGenerator: () => `resolver-${++id}`,
      resolveSecret: async () => { throw new Error("sensitive vault response"); },
      transport: {
        async send() {
          transportCalled = true;
          return { status: 204 };
        },
      },
    });
    const subscription = await hooks.createSubscription({
      tenantId, actor, endpoint: "https://hooks.example.test/events",
      events: ["content-type:create"], enabled: true, secretRef: "vault/private-ref",
    });
    await cms.registerContentType({ tenantId, actor, definition: baseDefinition() });
    const event = (await cms.listChangeEvents({ tenantId, actor })).items[0]!;
    await hooks.fanout({ tenantId, actor, eventId: event.id, expectedRevision: event.revision });
    const failed = await hooks.runNext({ tenantId, actor });
    const attempts = await hooks.listAttempts({ tenantId, actor, deliveryId: failed!.id });

    expect(transportCalled).toBe(false);
    expect(failed?.status).toBe("pending");
    expect(failed?.lastFailure).toBe("secret");
    expect(JSON.stringify({ failed, attempts })).not.toContain("sensitive vault response");
    expect(JSON.stringify({ failed, attempts })).not.toContain("vault/private-ref");
    expect((await hooks.getSubscription({ tenantId, actor, subscriptionId: subscription.id })).secretRef)
      .toBe("vault/private-ref");
  });
});
