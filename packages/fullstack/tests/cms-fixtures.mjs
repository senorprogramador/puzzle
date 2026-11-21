import { registerHooks } from "node:module";

const cmsEntry = new URL("../../cms/dist/index.js", import.meta.url).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@puzzle-ui/cms") {
      return nextResolve(cmsEntry, context);
    }
    return nextResolve(specifier, context);
  },
});

const { StorageConflictError, StorageDuplicateError } =
  await import("@puzzle-ui/storage");

const clone = (value) => structuredClone(value);

const compare = (left, right) => {
  const leftValue = left instanceof Date ? left.getTime() : left;
  const rightValue = right instanceof Date ? right.getTime() : right;
  return leftValue === rightValue ? 0 : leftValue < rightValue ? -1 : 1;
};

const matchesWhere = (record, where = {}) =>
  Object.entries(where).every(([field, comparison]) => {
    const value = record[field];
    switch (comparison.operator) {
      case "eq": return value === comparison.value;
      case "ne": return value !== comparison.value;
      case "in": return comparison.value.includes(value);
      case "notIn": return !comparison.value.includes(value);
      case "exists": return Boolean(comparison.value) === (value !== undefined);
      case "gt": return compare(value, comparison.value) > 0;
      case "gte": return compare(value, comparison.value) >= 0;
      case "lt": return compare(value, comparison.value) < 0;
      case "lte": return compare(value, comparison.value) <= 0;
      default: return false;
    }
  });

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
  collections = new Map();
  indexes = new Map();

  getCapabilities() {
    return { capabilities: this.capabilities };
  }

  async registerCollection({ name, indexes = [] }) {
    this.collections.set(name, this.collections.get(name) ?? new Map());
    this.indexes.set(name, indexes);
  }

  async findById(collection, id) {
    const record = this.collections.get(collection)?.get(id);
    return record ? clone(record) : null;
  }

  async findOne(collection, query) {
    return (await this.findMany(collection, query))[0] ?? null;
  }

  async findMany(collection, query = {}) {
    let rows = [...(this.collections.get(collection)?.values() ?? [])]
      .filter((record) => matchesWhere(record, query.where));
    for (const order of [...(query.orderBy ?? [])].reverse()) {
      rows.sort((left, right) => {
        const result = compare(left[order.field], right[order.field]);
        return order.direction === "asc" ? result : -result;
      });
    }
    const offset = query.offset ?? 0;
    rows = rows.slice(offset, query.limit === undefined ? undefined : offset + query.limit);
    return clone(rows);
  }

  async findPage(collection, query) {
    const records = await this.findMany(collection, {
      where: query.where,
      orderBy: [{ field: "id", direction: "asc" }],
    });
    const rows = records.filter((record) => !query.after || record.id > query.after.value);
    const items = rows.slice(0, query.first);
    const hasNextPage = rows.length > query.first;
    return {
      items,
      hasNextPage,
      nextCursor: hasNextPage ? { value: items.at(-1).id } : null,
    };
  }

  async insert(collection, input) {
    const rows = this.collections.get(collection);
    if (!rows) throw new Error(`Unknown collection ${collection}`);
    const record = {
      ...clone(input),
      createdAt: input.createdAt ?? new Date(),
      updatedAt: input.updatedAt ?? new Date(),
      revision: input.revision ?? 1,
    };
    if (rows.has(record.id)) throw new StorageDuplicateError("id");
    this.assertUnique(collection, record, record.id);
    rows.set(record.id, record);
    return clone(record);
  }

  async delete(collection, id, condition) {
    const rows = this.collections.get(collection);
    const record = rows?.get(id);
    if (!record) return false;
    if (condition?.expectedRevision !== undefined &&
        condition.expectedRevision !== record.revision) {
      throw new StorageConflictError();
    }
    return rows.delete(id);
  }

  async atomicBatch(operations) {
    const backup = new Map(
      [...this.collections].map(([name, records]) => [
        name,
        new Map([...records].map(([id, record]) => [id, clone(record)])),
      ]),
    );
    const results = [];
    try {
      for (const operation of operations) {
        const rows = this.collections.get(operation.collection);
        if (!rows) throw new Error(`Unknown collection ${operation.collection}`);
        if (operation.type === "insert") {
          const record = clone(operation.record);
          if (rows.has(record.id)) throw new StorageDuplicateError("id");
          this.assertUnique(operation.collection, record, record.id);
          const inserted = {
            ...record,
            createdAt: record.createdAt ?? new Date(),
            updatedAt: record.updatedAt ?? new Date(),
            revision: record.revision ?? 1,
          };
          rows.set(record.id, inserted);
          results.push({ type: "insert", record: clone(inserted) });
          continue;
        }

        const existing = rows.get(operation.id);
        if (
          !existing ||
          (operation.condition?.expectedRevision !== undefined &&
            existing.revision !== operation.condition.expectedRevision)
        ) {
          throw new StorageConflictError();
        }
        if (operation.type === "delete") {
          rows.delete(operation.id);
          results.push({ type: "delete", deleted: true });
          continue;
        }
        const updated = {
          ...existing,
          ...clone(operation.changes),
          revision: Number(existing.revision) + 1,
        };
        this.assertUnique(operation.collection, updated, operation.id);
        rows.set(operation.id, updated);
        results.push({ type: "update", record: clone(updated) });
      }
    } catch (error) {
      this.collections = backup;
      throw error;
    }
    return { results };
  }

  assertUnique(collection, candidate, excludingId) {
    for (const index of this.indexes.get(collection) ?? []) {
      if (!index.unique) continue;
      const values = index.fields.map((field) => candidate[field]);
      if (values.some((value) => value === undefined || value === null)) continue;
      const key = JSON.stringify(values);
      for (const [id, record] of this.collections.get(collection) ?? []) {
        if (id === excludingId) continue;
        if (JSON.stringify(index.fields.map((field) => record[field])) === key) {
          throw new StorageDuplicateError("unique index");
        }
      }
    }
  }
}

export const createCmsFixture = async (options = {}) => {
  const { createCmsServer } = await import("../dist/cms/server/index.js");
  const storage = new MemoryStorage();
  const calls = {
    authorization: [],
    policy: [],
    scheduled: [],
    cancelled: [],
  };
  let context = options.context ?? {
    tenantId: "tenant-a",
    actor: { id: "editor-a" },
  };
  let allowed = options.allowed ?? true;
  let policyAllowed = options.policyAllowed ?? true;
  let nextId = 0;
  const scheduler = {
    async schedule(publication) {
      calls.scheduled.push(clone(publication));
    },
    async cancel(publication) {
      calls.cancelled.push(clone(publication));
    },
  };
  const server = createCmsServer({
    storage,
    accessPolicy: async (access) => {
      calls.policy.push({
        action: access.action,
        resource: access.resource,
        tenantId: access.tenantId,
        actorId: access.actor?.id ?? null,
        visibility: access.visibility,
      });
      return policyAllowed;
    },
    scheduler,
    webhooks: options.webhooks,
    mediaReferenceValidator: options.mediaReferenceValidator,
    resolveContext: async () => context,
    authorize: async (access) => {
      calls.authorization.push({
        action: access.action,
        resource: access.resource,
        tenantId: access.context.tenantId,
        actorId: access.context.actor?.id ?? null,
        visibility: access.visibility,
        resourceId: access.resourceId,
      });
      return allowed;
    },
    clock: () => new Date("2026-01-01T00:00:00.000Z"),
    idGenerator: () => `cms-test-${++nextId}`,
  });
  return {
    calls,
    scheduler,
    server,
    storage,
    setContext(value) {
      context = value;
    },
    setAuthorization(value) {
      allowed = value;
    },
    setPolicy(value) {
      policyAllowed = value;
    },
  };
};

export const cmsRequest = (method, path, body) =>
  new Request(`https://example.test/api/cms${path}`, {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
  });

export const articleDefinition = () => ({
  slug: "article",
  name: "Article",
  version: 1,
  locales: ["en-US", "fr-FR"],
  defaultLocale: "en-US",
  fields: [
    { key: "title", type: "text", label: "Title", required: true, localized: true },
    { key: "path", type: "slug", label: "Path", required: true, localized: true },
    { key: "secretDraft", type: "text", label: "Draft-only field" },
    {
      key: "related",
      type: "relationship",
      label: "Related article",
      relation: { targetTypes: ["article"], multiple: true },
    },
  ],
});

export const json = (response) => response.json();
