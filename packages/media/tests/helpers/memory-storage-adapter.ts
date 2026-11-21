import {
  DEFAULT_STORAGE_CAPABILITIES,
  StorageCapabilityError,
  StorageDuplicateError,
  type StorageAdapter,
  type StorageBatchOperation,
  type StorageBatchResult,
  type StorageCapabilityReport,
  type StorageCollection,
  type StorageCollectionName,
  type StorageCondition,
  type StorageCursorQuery,
  type StorageInsert,
  type StoragePage,
  type StorageQuery,
  type StorageRecord,
  type StorageUpdate,
  type StorageWhere,
} from "@puzzle-ui/storage";

const toComparable = (value: unknown): string | number => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number" || typeof value === "string") return value;
  return JSON.stringify(value);
};

const equal = (left: unknown, right: unknown): boolean =>
  left instanceof Date && right instanceof Date
    ? left.getTime() === right.getTime()
    : JSON.stringify(left) === JSON.stringify(right);

const matchesWhere = <T extends StorageRecord>(
  record: T,
  where: StorageWhere<T> | undefined,
): boolean => {
  if (!where) return true;
  const value = record as unknown as Record<string, unknown>;
  for (const [field, condition] of Object.entries(where)) {
    if (field === "and") {
      if (!(condition as readonly StorageWhere<T>[]).every((item) => matchesWhere(record, item))) {
        return false;
      }
      continue;
    }
    if (field === "or") {
      if (!(condition as readonly StorageWhere<T>[]).some((item) => matchesWhere(record, item))) {
        return false;
      }
      continue;
    }
    if (!condition || typeof condition !== "object") continue;
    const actual = value[field];
    const comparison = condition as { readonly operator: string; readonly value: unknown };
    switch (comparison.operator) {
      case "eq":
        if (!equal(actual, comparison.value)) return false;
        break;
      case "ne":
        if (equal(actual, comparison.value)) return false;
        break;
      case "exists":
        if (
          Object.prototype.hasOwnProperty.call(value, field) !==
          comparison.value
        ) {
          return false;
        }
        break;
      case "in":
        if (
          !Array.isArray(comparison.value) ||
          !comparison.value.some((entry) => equal(actual, entry))
        ) {
          return false;
        }
        break;
      case "notIn":
        if (
          Array.isArray(comparison.value) &&
          comparison.value.some((entry) => equal(actual, entry))
        ) {
          return false;
        }
        break;
      case "gt":
      case "gte":
      case "lt":
      case "lte": {
        const left = toComparable(actual);
        const right = toComparable(comparison.value);
        if (
          (comparison.operator === "gt" && !(left > right)) ||
          (comparison.operator === "gte" && !(left >= right)) ||
          (comparison.operator === "lt" && !(left < right)) ||
          (comparison.operator === "lte" && !(left <= right))
        ) {
          return false;
        }
        break;
      }
      default:
        return false;
    }
  }
  return true;
};

export class MemoryStorageAdapter implements StorageAdapter {
  readonly capabilities: StorageAdapter["capabilities"];

  private readonly collections = new Map<
    StorageCollectionName,
    { readonly options: StorageCollection<StorageRecord>; readonly records: Map<string, StorageRecord> }
  >();

  constructor(options: { readonly conditionalWrites?: boolean } = {}) {
    this.capabilities = {
      ...DEFAULT_STORAGE_CAPABILITIES,
      conditionalWrites: options.conditionalWrites ?? true,
      uniqueConstraints: true,
      upsert: true,
      cursorPagination: true,
    };
  }

  getCapabilities(): StorageCapabilityReport {
    return { capabilities: this.capabilities };
  }

  async registerCollection<T extends StorageRecord>(
    collection: StorageCollection<T>,
  ): Promise<void> {
    const existing = this.collections.get(collection.name);
    if (existing) return;
    this.collections.set(collection.name, {
      options: collection as unknown as StorageCollection<StorageRecord>,
      records: new Map(),
    });
  }

  async findById<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
  ): Promise<T | null> {
    return (this.collection(collection).records.get(id) as T | undefined) ?? null;
  }

  async findOne<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<T | null> {
    return (await this.findMany<T>(collection, { ...query, limit: 1 }))[0] ?? null;
  }

  async findMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T> = {},
  ): Promise<readonly T[]> {
    let records = [...this.collection(collection).records.values()].filter((record) =>
      matchesWhere(record as T, query.where),
    ) as T[];
    for (const order of [...(query.orderBy ?? [])].reverse()) {
      records = records.sort((left, right) => {
        const leftValue = (left as unknown as Record<string, unknown>)[order.field];
        const rightValue = (right as unknown as Record<string, unknown>)[order.field];
        const compared =
          toComparable(leftValue) < toComparable(rightValue)
            ? -1
            : toComparable(leftValue) > toComparable(rightValue)
              ? 1
              : 0;
        return order.direction === "asc" ? compared : -compared;
      });
    }
    const offset = query.offset ?? 0;
    return records.slice(offset, query.limit === undefined ? undefined : offset + query.limit);
  }

  async findPage<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageCursorQuery<T>,
  ): Promise<StoragePage<T>> {
    const all = await this.findMany<T>(collection, {
      where: query.where,
      orderBy: query.orderBy,
    });
    let start = 0;
    if (query.after) {
      const index = all.findIndex((record) => record.id === query.after?.value);
      if (index >= 0) start = index + 1;
    }
    const items = all.slice(start, start + query.first);
    const hasNextPage = start + items.length < all.length;
    return {
      items,
      hasNextPage,
      nextCursor: hasNextPage
        ? { value: items.at(-1)?.id ?? "" }
        : null,
    };
  }

  async insert<T extends StorageRecord>(
    collection: StorageCollectionName,
    input: StorageInsert<T>,
  ): Promise<T> {
    const target = this.collection(collection);
    const record = {
      ...input,
      createdAt: input.createdAt ?? new Date(),
      updatedAt: input.updatedAt ?? new Date(),
      revision: input.revision ?? 1,
    } as T;
    if (target.records.has(record.id)) {
      throw new StorageDuplicateError("id");
    }
    this.validateRecord(target.options, record);
    this.assertUnique(target.options, target.records, record);
    target.records.set(record.id, record);
    return record;
  }

  async upsert<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
    input: StorageInsert<T>,
  ): Promise<T> {
    const existing = await this.findOne<T>(collection, query);
    if (!existing) return this.insert<T>(collection, input);
    const changes = input as StorageUpdate<T>;
    return (await this.update<T>(collection, existing.id, changes)) ?? existing;
  }

  async update<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
    changes: StorageUpdate<T>,
    condition?: StorageCondition,
  ): Promise<T | null> {
    const target = this.collection(collection);
    const current = target.records.get(id) as T | undefined;
    if (!current || !this.matchesCondition(current, condition)) return null;
    const updated = {
      ...current,
      ...changes,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: changes.updatedAt ?? new Date(),
      revision: current.revision + 1,
    } as T;
    this.validateRecord(target.options, updated);
    this.assertUnique(target.options, target.records, updated, id);
    target.records.set(id, updated);
    return updated;
  }

  async updateMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
    changes: StorageUpdate<T>,
  ): Promise<number> {
    const records = await this.findMany<T>(collection, query);
    let updated = 0;
    for (const record of records) {
      if (await this.update<T>(collection, record.id, changes)) updated += 1;
    }
    return updated;
  }

  async delete<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
    condition?: StorageCondition,
  ): Promise<boolean> {
    const target = this.collection(collection);
    const current = target.records.get(id);
    if (!current || !this.matchesCondition(current, condition)) return false;
    return target.records.delete(id);
  }

  async deleteMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<number> {
    const records = await this.findMany<T>(collection, query);
    let deleted = 0;
    for (const record of records) {
      if (await this.delete<T>(collection, record.id)) deleted += 1;
    }
    return deleted;
  }

  async exists<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<boolean> {
    return (await this.findOne<T>(collection, query)) !== null;
  }

  async count<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T> = {},
  ): Promise<number> {
    return (await this.findMany<T>(collection, query)).length;
  }

  async atomicBatch<T extends StorageRecord>(
    _operations: readonly StorageBatchOperation<T>[],
  ): Promise<StorageBatchResult<T>> {
    throw new StorageCapabilityError("atomicBatch");
  }

  reset(): void {
    for (const collection of this.collections.values()) collection.records.clear();
  }

  private collection(name: string) {
    const collection = this.collections.get(name);
    if (!collection) throw new Error(`Collection "${name}" was not registered.`);
    return collection;
  }

  private validateRecord<T extends StorageRecord>(
    options: StorageCollection<StorageRecord>,
    record: T,
  ): void {
    if (options.schema && !options.schema.validate(record)) {
      throw new Error(`Record failed schema validation for "${options.name}".`);
    }
  }

  private assertUnique<T extends StorageRecord>(
    options: StorageCollection<StorageRecord>,
    records: Map<string, StorageRecord>,
    candidate: T,
    exceptId?: string,
  ): void {
    const candidateValues = candidate as unknown as Record<string, unknown>;
    for (const index of options.indexes ?? []) {
      if (!index.unique) continue;
      for (const existing of records.values()) {
        if (existing.id === exceptId) continue;
        const existingValues = existing as unknown as Record<string, unknown>;
        if (
          index.fields.every((field) =>
            equal(candidateValues[field], existingValues[field]),
          )
        ) {
          throw new StorageDuplicateError(index.name);
        }
      }
    }
  }

  private matchesCondition<T extends StorageRecord>(
    record: T,
    condition: StorageCondition | undefined,
  ): boolean {
    if (!condition) return true;
    if (
      condition.expectedRevision !== undefined &&
      record.revision !== condition.expectedRevision
    ) {
      return false;
    }
    if (
      condition.expectedUpdatedAt !== undefined &&
      record.updatedAt.getTime() !== condition.expectedUpdatedAt.getTime()
    ) {
      return false;
    }
    return true;
  }
}
