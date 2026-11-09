import { StorageDuplicateError } from "@puzzle-ui/storage";

import { StorageAuthManager } from "../../dist/index.js";

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
  definitions = new Map();

  batchTail = Promise.resolve();
  failNextBatch = false;

  getCapabilities() {
    return {
      capabilities: this.capabilities,
    };
  }

  async registerCollection(definition) {
    this.definitions.set(definition.name, definition);

    if (!this.collections.has(definition.name)) {
      this.collections.set(definition.name, new Map());
    }
  }

  getCollection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }

    return this.collections.get(name);
  }

  matches(record, where = {}) {
    return Object.entries(where).every(([field, condition]) => {
      if (field === "and") {
        return condition.every((item) => this.matches(record, item));
      }

      if (field === "or") {
        return condition.some((item) => this.matches(record, item));
      }

      const actual = record[field];
      const expected = condition.value;

      switch (condition.operator) {
        case "eq":
          return actual instanceof Date && expected instanceof Date
            ? actual.getTime() === expected.getTime()
            : actual === expected;

        case "ne":
          return actual !== expected;

        case "in":
          return condition.value.includes(actual);

        default:
          return false;
      }
    });
  }

  async findById(collection, id) {
    return this.getCollection(collection).get(id) ?? null;
  }

  async findOne(collection, query = {}) {
    const records = [...this.getCollection(collection).values()];

    return records.find((record) => this.matches(record, query.where)) ?? null;
  }

  async findMany(collection, query = {}) {
    let records = [...this.getCollection(collection).values()];

    if (query.where) {
      records = records.filter((record) => this.matches(record, query.where));
    }

    return records;
  }

  assertUnique(collection, record) {
    const definition = this.definitions.get(collection);
    const records = this.getCollection(collection);

    if (records.has(record.id)) {
      throw new StorageDuplicateError("primary_key");
    }

    for (const index of definition?.indexes ?? []) {
      if (!index.unique) continue;

      const duplicate = [...records.values()].some((existing) =>
        index.fields.every((field) => existing[field] === record[field]),
      );

      if (duplicate) {
        throw new StorageDuplicateError(index.name);
      }
    }
  }

  async atomicBatch(operations) {
    let release;

    const previous = this.batchTail;

    this.batchTail = new Promise((resolve) => {
      release = resolve;
    });

    await previous;

    const snapshot = new Map(
      [...this.collections.entries()].map(([name, records]) => [
        name,
        new Map(records),
      ]),
    );

    const results = [];

    try {
      for (const operation of operations) {
        if (operation.type !== "insert") {
          throw new Error(`Unsupported test operation: ${operation.type}`);
        }

        const records = this.getCollection(operation.collection);
        const record = operation.record;

        this.assertUnique(operation.collection, record);

        const stored = {
          ...record,
          createdAt: record.createdAt ?? new Date(),
          updatedAt: record.updatedAt ?? new Date(),
          revision: record.revision ?? 1,
        };

        records.set(stored.id, stored);

        results.push({
          type: "insert",
          record: stored,
        });
      }

      if (this.failNextBatch) {
        this.failNextBatch = false;

        throw new Error("Simulated atomic batch failure.");
      }

      return { results };
    } catch (error) {
      this.collections = snapshot;
      throw error;
    } finally {
      release();
    }
  }

  async count(collection) {
    return this.getCollection(collection).size;
  }
}

export class FakePasswordHasher {
  hashCalls = [];
  verifyCalls = [];

  async hash(password) {
    this.hashCalls.push(password);

    return {
      hash: `test-hash:${password}`,
      algorithm: "argon2id",
      parameters: {
        test: true,
      },
    };
  }

  async verify(password, stored) {
    this.verifyCalls.push({
      password,
      stored,
    });

    return stored.hash === `test-hash:${password}`;
  }
}

export class FakeRateLimitProvider {
  calls = [];
  denyNext = false;

  async consume(input) {
    this.calls.push(input);

    if (this.denyNext) {
      this.denyNext = false;

      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + 60_000),
      };
    }

    return {
      allowed: true,
      remaining: input.limit - 1,
      resetAt: new Date(Date.now() + input.windowSeconds * 1000),
    };
  }
}

export class FakeSessionManager {
  sessions = new Map();
  sequence = 0;
  failNextCreate = false;

  async create(input) {
    if (this.failNextCreate) {
      this.failNextCreate = false;
      throw new Error("Simulated session creation failure.");
    }

    this.sequence++;

    const now = new Date();
    const id = `session-${this.sequence}`;
    const token = `test-token-${this.sequence}`;

    const session = {
      id,
      tokenHash: `test-token-hash-${this.sequence}`,
      userId: input.userId,
      kind: input.kind,
      createdAt: now,
      lastSeenAt: now,
      expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
      revokedAt: null,
      metadata: input.metadata,
    };

    this.sessions.set(token, session);

    return {
      session,
      token,
    };
  }

  async validate(token) {
    const session = this.sessions.get(token);

    if (!session || session.revokedAt) {
      return null;
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return session;
  }

  async rotate(input) {
    const entry = [...this.sessions.entries()].find(
      ([, session]) => session.id === input.sessionId,
    );

    if (!entry) {
      throw new Error("Session not found.");
    }

    const [token, session] = entry;

    this.sessions.set(token, {
      ...session,
      revokedAt: new Date(),
    });

    return this.create({
      userId: session.userId,
      kind: session.kind,
      metadata: input.metadata,
    });
  }

  async revoke(sessionId) {
    for (const [token, session] of this.sessions) {
      if (session.id === sessionId) {
        this.sessions.set(token, {
          ...session,
          revokedAt: new Date(),
        });
      }
    }
  }

  async revokeAll(userId) {
    for (const [token, session] of this.sessions) {
      if (session.userId === userId) {
        this.sessions.set(token, {
          ...session,
          revokedAt: new Date(),
        });
      }
    }
  }

  async get(sessionId) {
    return (
      [...this.sessions.values()].find((session) => session.id === sessionId) ??
      null
    );
  }

  async list(userId, currentSessionId) {
    return [...this.sessions.values()]
      .filter(
        (session) => session.userId === userId && session.revokedAt === null,
      )
      .map((session) => ({
        sessionId: session.id,
        kind: session.kind,
        createdAt: session.createdAt,
        lastSeenAt: session.lastSeenAt,
        expiresAt: session.expiresAt,
        current: session.id === currentSessionId,
        metadata: session.metadata,
      }));
  }
}

export const createAuthHarness = async (options = {}) => {
  const storage = new MemoryStorage();
  const passwordHasher = new FakePasswordHasher();
  const rateLimitProvider = new FakeRateLimitProvider();
  const sessions = new FakeSessionManager();

  const auth = new StorageAuthManager(
    {
      storage,
      passwordHasher,
      rateLimitProvider,
      sessions,
    },
    {
      rateLimitKeySecret: "test-only-auth-rate-limit-secret-000000",
      ...options,
    },
  );

  await auth.initialize();

  return {
    auth,
    storage,
    passwordHasher,
    rateLimitProvider,
    sessions,
  };
};
