import test from "node:test";
import assert from "node:assert/strict";

import { StorageSessionManager } from "../dist/index.js";

class MemoryStorage {
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
      throw new Error("Duplicate record");
    }

    if (
      [...records.values()].some((item) => item.tokenHash === record.tokenHash)
    ) {
      throw new Error("Duplicate token hash");
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
      throw new Error("Storage conflict");
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

  async atomicBatch(operations) {
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
            throw new Error("Atomic update failed");
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

        results.push({
          type: "delete",
          deleted,
        });
      }

      return { results };
    } catch (error) {
      this.collections = snapshot;
      throw error;
    }
  }
}

const createHarness = () => {
  const storage = new MemoryStorage();

  let currentTime = new Date("2026-11-09T10:00:00.000Z");

  const sessions = new StorageSessionManager(storage, {
    lifetime: {
      idleTimeoutSeconds: 3600,
      absoluteLifetimeSeconds: 86400,
    },
    maximumSessionsPerUser: 10,
    touchIntervalSeconds: 60,
    clock: () => new Date(currentTime),
  });

  return {
    storage,
    sessions,
    setTime(value) {
      currentTime = new Date(value);
    },
  };
};

test("creates an anonymous session", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const result = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  assert.ok(result.session.id);
  assert.ok(result.token);
  assert.equal(result.session.kind, "anonymous");
  assert.equal(result.session.userId, null);
  assert.equal(result.session.revokedAt, null);
});

test("creates an authenticated session", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const result = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  assert.equal(result.session.userId, "user-1");
  assert.equal(result.session.kind, "authenticated");
});

test("rejects authenticated sessions without a user ID", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  await assert.rejects(
    () =>
      sessions.create({
        kind: "authenticated",
        userId: null,
      }),
    /user ID/,
  );
});

test("rejects anonymous sessions with a user ID", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  await assert.rejects(
    () =>
      sessions.create({
        kind: "anonymous",
        userId: "user-1",
      }),
    /cannot have a user ID/,
  );
});

test("validates a stored session token", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const validated = await sessions.validate(created.token);

  assert.equal(validated.id, created.session.id);
});

test("does not expose raw tokens in persisted records", async () => {
  const { storage, sessions } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const stored = await storage.findById("sessions", created.session.id);

  assert.notEqual(stored.tokenHash, created.token);
  assert.equal(stored.tokenHash.length > 0, true);
});

test("rejects unknown tokens", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  assert.equal(await sessions.validate("x".repeat(43)), null);
});

test("revokes an individual session", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  await sessions.revoke(created.session.id);

  assert.equal(await sessions.validate(created.token), null);
});

test("revokes every session belonging to a user", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const first = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const second = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  await sessions.revokeAll("user-1");

  assert.equal(await sessions.validate(first.token), null);
  assert.equal(await sessions.validate(second.token), null);
});

test("rotates a session and invalidates its previous token", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const original = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const rotated = await sessions.rotate({
    sessionId: original.session.id,
  });

  assert.notEqual(rotated.session.id, original.session.id);
  assert.notEqual(rotated.token, original.token);

  assert.equal(await sessions.validate(original.token), null);
  assert.ok(await sessions.validate(rotated.token));
});

test("lists active sessions with current-device metadata", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const first = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const devices = await sessions.list("user-1", first.session.id);

  assert.equal(devices.length, 2);
  assert.equal(devices.filter((device) => device.current).length, 1);
});

test("does not validate an expired session", async () => {
  const { sessions, setTime } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  setTime("2026-11-09T12:00:01.000Z");

  assert.equal(await sessions.validate(created.token), null);
});

test("does not validate an absolutely expired session", async () => {
  const { sessions, setTime } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  setTime("2026-11-10T10:00:01.000Z");

  assert.equal(await sessions.validate(created.token), null);
});

test("touches a session after the configured interval", async () => {
  const { sessions, setTime } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  setTime("2026-11-09T10:02:00.000Z");

  const validated = await sessions.validate(created.token);

  assert.ok(validated);
  assert.equal(validated.lastSeenAt.toISOString(), "2026-11-09T10:02:00.000Z");
});

test("does not touch a session when touch is disabled", async () => {
  const { sessions, setTime } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  setTime("2026-11-09T10:02:00.000Z");

  const validated = await sessions.validate(created.token, { touch: false });

  assert.equal(
    validated.lastSeenAt.toISOString(),
    created.session.lastSeenAt.toISOString(),
  );
});
