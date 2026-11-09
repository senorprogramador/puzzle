import {
  StorageConflictError,
  StorageDuplicateError,
} from "@puzzle-ui/storage";

export class MemoryStorage {
  capabilities = {
    transactions: true,
    atomicBatch: true,
    conditionalWrites: true,
    uniqueConstraints: true,
    upsert: true,
    cursorPagination: true,
    migrations: true,
    ttlIndexes: false,
  };

  collections = new Map();

  batchTail = Promise.resolve();

  failNextBatch = false;

  async atomicBatch(operations) {
    let release;

    const previous = this.batchTail;

    this.batchTail = new Promise((resolve) => {
      release = resolve;
    });

    await previous;

    const snapshot = new Map();

    for (const [name, records] of this.collections) {
      snapshot.set(name, new Map(records));
    }

    const results = [];

    try {
      for (const operation of operations) {
        if (operation.type === "insert") {
          const record = await this.insert(
            operation.collection,
            operation.record,
          );

          results.push({
            type: "insert",
            record,
          });

          continue;
        }

        if (operation.type === "update") {
          const record = await this.update(
            operation.collection,
            operation.id,
            operation.changes,
            operation.condition,
          );

          if (!record) {
            throw new StorageConflictError();
          }

          results.push({
            type: "update",
            record,
          });

          continue;
        }

        const deleted = await this.delete(
          operation.collection,
          operation.id,
          operation.condition,
        );

        if (!deleted && operation.condition) {
          throw new StorageConflictError();
        }

        results.push({
          type: "delete",
          deleted,
        });
      }

      if (this.failNextBatch) {
        this.failNextBatch = false;
        throw new Error("Simulated transaction failure");
      }

      return { results };
    } catch (error) {
      this.collections = snapshot;
      throw error;
    } finally {
      release();
    }
  }

  getCapabilities() {
    return { capabilities: this.capabilities };
  }

  async registerCollection(definition) {
    this.collections.set(
      definition.name,
      this.collections.get(definition.name) ?? new Map(),
    );
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }

    return this.collections.get(name);
  }

  async insert(collection, record) {
    const records = this.collection(collection);

    if (records.has(record.id)) {
      throw new StorageDuplicateError("primary_key");
    }

    const values = [...records.values()];

    if (
      collection === "sessions" &&
      values.some((item) => item.tokenHash === record.tokenHash)
    ) {
      throw new StorageDuplicateError("token_hash");
    }

    if (
      collection === "session_user_locks" &&
      values.some((item) => item.userId === record.userId)
    ) {
      throw new StorageDuplicateError("user_id");
    }

    if (
      collection === "session_data" &&
      values.some(
        (item) =>
          item.ownerId === record.ownerId &&
          item.namespace === record.namespace &&
          item.key === record.key,
      )
    ) {
      throw new StorageDuplicateError("owner_namespace_key");
    }

    const now = new Date();

    const stored = {
      ...record,
      createdAt: record.createdAt ?? now,
      updatedAt: record.updatedAt ?? now,
      revision: record.revision ?? 1,
    };

    records.set(stored.id, stored);

    return stored;
  }

  async findById(collection, id) {
    return this.collection(collection).get(id) ?? null;
  }

  matches(record, where = {}) {
    return Object.entries(where).every(([field, comparison]) => {
      if (field === "and") {
        return comparison.every((item) => this.matches(record, item));
      }

      if (field === "or") {
        return comparison.some((item) => this.matches(record, item));
      }

      const actual = record[field];
      const expected = comparison.value;

      switch (comparison.operator) {
        case "eq":
          return actual instanceof Date && expected instanceof Date
            ? actual.getTime() === expected.getTime()
            : actual === expected;
        case "ne":
          return actual !== expected;
        case "lte":
          return actual <= expected;
        case "gte":
          return actual >= expected;
        case "in":
          return comparison.value.includes(actual);
        default:
          return false;
      }
    });
  }

  async findOne(collection, query = {}) {
    return (
      (
        await this.findMany(collection, {
          ...query,
          limit: 1,
        })
      )[0] ?? null
    );
  }

  async findMany(collection, query = {}) {
    let records = [...this.collection(collection).values()];

    if (query.where) {
      records = records.filter((record) => this.matches(record, query.where));
    }

    if (query.orderBy) {
      records.sort((a, b) => {
        for (const order of query.orderBy) {
          const left = a[order.field];
          const right = b[order.field];

          const comparison =
            left instanceof Date && right instanceof Date
              ? left.getTime() - right.getTime()
              : left < right
                ? -1
                : left > right
                  ? 1
                  : 0;

          if (comparison !== 0) {
            return order.direction === "asc" ? comparison : -comparison;
          }
        }

        return 0;
      });
    }

    return records.slice(
      query.offset ?? 0,
      query.limit === undefined ? undefined : (query.offset ?? 0) + query.limit,
    );
  }

  async update(collection, id, changes, condition) {
    const records = this.collection(collection);
    const current = records.get(id);

    if (!current) return null;

    if (
      condition?.expectedRevision !== undefined &&
      condition.expectedRevision !== current.revision
    ) {
      throw new StorageConflictError();
    }

    const updated = {
      ...current,
      ...changes,
      updatedAt: new Date(),
      revision: current.revision + 1,
    };

    records.set(id, updated);

    return updated;
  }

  async updateMany(collection, query, changes) {
    const records = this.collection(collection);
    let count = 0;

    for (const [id, record] of records) {
      if (!this.matches(record, query.where)) continue;

      records.set(id, {
        ...record,
        ...changes,
        updatedAt: new Date(),
        revision: record.revision + 1,
      });

      count++;
    }

    return count;
  }

  async delete(collection, id, condition) {
    const records = this.collection(collection);
    const current = records.get(id);

    if (!current) return false;

    if (
      condition?.expectedRevision !== undefined &&
      current.revision !== condition.expectedRevision
    ) {
      throw new Error("Storage conflict");
    }

    return records.delete(id);
  }

  async deleteMany(collection, query) {
    const records = this.collection(collection);
    let count = 0;

    for (const [id, record] of records) {
      if (this.matches(record, query.where)) {
        records.delete(id);
        count++;
      }
    }

    return count;
  }

  async count(collection, query = {}) {
    return (await this.findMany(collection, query)).length;
  }
}
