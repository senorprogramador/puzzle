import { describe, expect, it } from "bun:test";
import type { Db } from "mongodb";

import {
  StorageDuplicateError,
  StorageValidationError,
  type StorageRecord,
} from "@puzzle-ui/storage";

import { MongoStorageAdapter } from "../src/mongodb.adapter";
import { MongoStorageMigrationAdapter } from "../src/mongodb.migrations";

type TestRecord = StorageRecord & {
  name: string;
  active: boolean;
  lastSeen: Date;
};

type Row = Record<string, unknown> & { _id?: string };

const errorWithCode = (code: number) => Object.assign(new Error("mongo error"), { code });

const createMockDatabase = (initialDocuments: readonly Row[] = []) => {
  const collections = new Map<string, Map<string, Row>>();
  const collectionNames = new Set<string>();
  const calls: {
    findFilter?: Record<string, unknown>;
    findSort?: Record<string, 1 | -1>;
    findSkip?: number;
    findLimit?: number;
    insertDocument?: Row;
    duplicateInsert?: boolean;
    insertError?: Error;
    pageDocuments: Row[];
  } = { pageDocuments: [...initialDocuments] };

  const getRows = (name: string) => {
    let rows = collections.get(name);
    if (!rows) {
      rows = new Map();
      collections.set(name, rows);
    }
    return rows;
  };

  const createCollectionObject = (name: string) => {
    const rows = getRows(name);
    return {
      createIndexes: async () => [],
      dropIndex: async () => undefined,
      find: (filter: Record<string, unknown>) => {
        calls.findFilter = filter;
        const cursor = {
          sort(sort: Record<string, 1 | -1>) {
            calls.findSort = sort;
            return cursor;
          },
          skip(value: number) {
            calls.findSkip = value;
            return cursor;
          },
          limit(value: number) {
            calls.findLimit = value;
            return cursor;
          },
          async toArray() {
            if (name.endsWith("_migrations")) {
              return [...rows.values()]
                .filter(
                  (row) =>
                    (filter._id as { $ne?: string } | undefined)?.$ne ===
                      undefined ||
                    row._id !==
                      (filter._id as { $ne: string }).$ne,
                )
                .sort(
                  (left, right) =>
                    Number(left.version) - Number(right.version),
                );
            }
            return [...calls.pageDocuments];
          },
        };
        return cursor;
      },
      findOne: async (filter: Record<string, unknown>) => {
        if (typeof filter._id === "string") {
          return rows.get(filter._id) ?? null;
        }
        if (
          typeof filter._id === "object" &&
          filter._id !== null &&
          "$ne" in filter._id
        ) {
          const excluded = (filter._id as { $ne: string }).$ne;
          return [...rows.values()].filter((row) => row._id !== excluded)[0] ?? null;
        }
        return null;
      },
      insertOne: async (document: Row) => {
        calls.insertDocument = document;
        if (calls.insertError) throw calls.insertError;
        if (calls.duplicateInsert) throw errorWithCode(11000);
        const id = String(document._id);
        rows.set(id, document);
        return { insertedId: id };
      },
      updateOne: async (
        filter: Record<string, unknown>,
        update: Record<string, unknown>,
        options?: { upsert?: boolean },
      ) => {
        const id = String(filter._id);
        const existing = rows.get(id);
        if (name.endsWith("migration_locks")) {
          const lockSet = (update.$set ?? {}) as Row;
          const or = filter.$or as
            | readonly { expiresAt?: { $lt: Date }; owner?: string }[]
            | undefined;
          const now = or?.[0]?.expiresAt?.$lt;
          const ownerMatches = or?.[1]?.owner === existing?.owner;
          const expired =
            now !== undefined &&
            existing?.expiresAt instanceof Date &&
            existing.expiresAt < now;
          if (existing && !ownerMatches && !expired) {
            if (options?.upsert) throw errorWithCode(11000);
            return { matchedCount: 0 };
          }
          rows.set(id, { ...existing, ...lockSet, _id: id });
          return { matchedCount: existing ? 1 : 0, upsertedCount: existing ? 0 : 1 };
        }

        const set = (update.$set ?? {}) as Row;
        const unset = (update.$unset ?? {}) as Record<string, unknown>;
        const updated: Row = { ...existing, ...set, _id: id };
        for (const key of Object.keys(unset)) delete updated[key];
        if (!existing && options?.upsert) rows.set(id, updated);
        else if (existing) rows.set(id, updated);
        return { matchedCount: existing ? 1 : 0 };
      },
      deleteOne: async (filter: Record<string, unknown>) => {
        const id = String(filter._id);
        const existing = rows.get(id);
        if (
          existing &&
          (filter.owner === undefined || existing.owner === filter.owner)
        ) {
          rows.delete(id);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      },
    };
  };

  const database = {
    collection: (name: string) => createCollectionObject(name),
    createCollection: async (name: string) => {
      if (collectionNames.has(name)) throw errorWithCode(48);
      collectionNames.add(name);
      getRows(name);
      return undefined;
    },
  } as unknown as Db;

  return { database, calls, collections };
};

describe("MongoStorageAdapter query and document gaps", () => {
  it("preserves BSON dates and converts Mongo _id values to storage ids", async () => {
    const { database, calls, collections } = createMockDatabase();
    const adapter = new MongoStorageAdapter({ database });
    const createdAt = new Date("2026-03-04T05:06:07.000Z");
    const lastSeen = new Date("2026-04-05T06:07:08.000Z");

    const inserted = await adapter.insert<TestRecord>("users", {
      id: "ada",
      name: "Ada",
      active: true,
      lastSeen,
      createdAt,
    } as TestRecord);

    expect(calls.insertDocument?.createdAt).toBe(createdAt);
    expect(calls.insertDocument?.lastSeen).toBe(lastSeen);
    expect(inserted.id).toBe("ada");
    expect(inserted.createdAt).toBe(createdAt);
    expect(inserted.lastSeen).toBe(lastSeen);

    collections.get("puzzle_users")?.set("grace", {
      _id: "grace",
      name: "Grace",
      active: false,
      lastSeen,
      createdAt,
      updatedAt: createdAt,
      revision: 1,
    });

    const fetched = await adapter.findById<TestRecord>("users", "grace");
    expect(fetched).toMatchObject({
      id: "grace",
      name: "Grace",
      lastSeen,
      createdAt,
    });
    expect(fetched?.lastSeen).toBeInstanceOf(Date);
  });

  it("translates nested boolean and comparison operators to Mongo filters", async () => {
    const { database, calls } = createMockDatabase();
    const adapter = new MongoStorageAdapter({ database });

    await adapter.findMany<TestRecord>("users", {
      where: {
        and: [
          { active: { operator: "eq", value: true } },
          {
            or: [
              { lastSeen: { operator: "gte", value: new Date("2026-01-01") } },
              { name: { operator: "in", value: ["Ada", "Grace"] } },
            ],
          },
        ],
      },
    });

    expect(calls.findFilter).toEqual({
      $and: [
        { active: { $eq: true } },
        {
          $or: [
            { lastSeen: { $gte: new Date("2026-01-01") } },
            { name: { $in: ["Ada", "Grace"] } },
          ],
        },
      ],
    });
  });

  it("rejects unsupported operators before issuing a Mongo query", async () => {
    const { database, calls } = createMockDatabase();
    const adapter = new MongoStorageAdapter({ database });

    await expect(
      adapter.findMany<TestRecord>("users", {
        where: { name: { operator: "contains", value: "Ada" } } as never,
      }),
    ).rejects.toBeInstanceOf(StorageValidationError);
    expect(calls.findFilter).toBeUndefined();
  });

  it("maps duplicate-key writes to a storage duplicate error", async () => {
    const { database, calls } = createMockDatabase();
    calls.duplicateInsert = true;
    const adapter = new MongoStorageAdapter({ database });

    await expect(
      adapter.insert<TestRecord>("users", {
        id: "duplicate",
        name: "Ada",
        active: true,
        lastSeen: new Date(),
      } as TestRecord),
    ).rejects.toBeInstanceOf(StorageDuplicateError);
  });

  it("preserves unrelated Mongo write failures", async () => {
    const { database, calls } = createMockDatabase();
    const failure = new Error("connection lost");
    calls.insertError = failure;
    const adapter = new MongoStorageAdapter({ database });

    await expect(
      adapter.insert<TestRecord>("users", {
        id: "ada",
        name: "Ada",
        active: true,
        lastSeen: new Date(),
      } as TestRecord),
    ).rejects.toBe(failure);
  });

  it("validates cursor boundaries and returns the next-page cursor", async () => {
    const documents: Row[] = [
      { _id: "a", name: "Ada" },
      { _id: "b", name: "Grace" },
      { _id: "c", name: "Lin" },
    ];
    const { database, calls } = createMockDatabase(documents);
    const adapter = new MongoStorageAdapter({ database });

    await expect(
      adapter.findPage<TestRecord>("users", { first: 0 }),
    ).rejects.toBeInstanceOf(StorageValidationError);
    await expect(
      adapter.findPage<TestRecord>("users", {
        first: 2,
        after: { value: "not-json" },
      }),
    ).rejects.toBeInstanceOf(StorageValidationError);

    const page = await adapter.findPage<TestRecord>("users", {
      first: 2,
      orderBy: [{ field: "name", direction: "asc" }],
    });

    expect(page.items.map(({ id }) => id)).toEqual(["a", "b"]);
    expect(page.hasNextPage).toBe(true);
    expect(page.nextCursor).not.toBeNull();
    expect(calls.findLimit).toBe(3);
    expect(calls.findSort).toEqual({ name: 1, _id: 1 });
    expect(
      JSON.parse(
        Buffer.from(page.nextCursor!.value, "base64url").toString("utf8"),
      ),
    ).toEqual({ values: ["Grace", "b"] });

    await adapter.findPage<TestRecord>("users", {
      first: 2,
      orderBy: [{ field: "name", direction: "asc" }],
      after: page.nextCursor!,
    });
    expect(calls.findFilter).toEqual({
      $or: [
        { $and: [{ name: { $gt: "Grace" } }] },
        { $and: [{ name: "Grace" }, { _id: { $gt: "b" } }] },
      ],
    });

    calls.pageDocuments.splice(2, 1);
    const finalPage = await adapter.findPage<TestRecord>("users", {
      first: 2,
      orderBy: [{ field: "name", direction: "asc" }],
    });
    expect(finalPage.hasNextPage).toBe(false);
    expect(finalPage.nextCursor).toBeNull();
  });

  it("applies skip, limit, and stable id ordering to offset pagination", async () => {
    const { database, calls } = createMockDatabase();
    const adapter = new MongoStorageAdapter({ database });

    await adapter.findMany<TestRecord>("users", {
      limit: 5,
      offset: 2,
      orderBy: [{ field: "name", direction: "desc" }],
    });

    expect(calls.findSkip).toBe(2);
    expect(calls.findLimit).toBe(5);
    expect(calls.findSort).toEqual({ name: -1, _id: 1 });
  });
});

describe("MongoStorageMigrationAdapter gaps", () => {
  it("runs migrations by version and skips records already completed", async () => {
    const { database } = createMockDatabase();
    const adapter = new MongoStorageMigrationAdapter({ database });
    const executionOrder: number[] = [];
    const migrations = [2, 1].map((version) => ({
      id: `ordered-${version}`,
      version,
      description: `Migration ${version}`,
      up: async () => {
        executionOrder.push(version);
      },
    }));

    const first = await adapter.runMigrations(migrations);
    const second = await adapter.runMigrations(migrations);

    expect(executionOrder).toEqual([1, 2]);
    expect(first.applied).toEqual([1, 2]);
    expect(first.currentVersion).toBe(2);
    expect(second.applied).toEqual([]);
    expect(second.skipped).toEqual([1, 2]);
  });

  it("persists failed migrations and removes the acquired lock", async () => {
    const { database, collections } = createMockDatabase();
    const adapter = new MongoStorageMigrationAdapter({ database });

    await expect(
      adapter.runMigrations([
        {
          id: "failure-cleanup",
          version: 1,
          description: "Fail and clean up",
          up: async () => {
            throw new Error("migration failed");
          },
        },
      ]),
    ).rejects.toThrow("migration failed");

    expect(
      collections.get("puzzle_migrations")?.get("failure-cleanup"),
    ).toMatchObject({ status: "failed", error: "migration failed" });
    expect(
      collections.get("puzzle_migration_locks")?.has("global"),
    ).toBe(false);
  });

  it("serializes concurrent migration runners and applies once", async () => {
    const { database } = createMockDatabase();
    const adapterA = new MongoStorageMigrationAdapter({
      database,
      lockDurationMs: 2_000,
    });
    const adapterB = new MongoStorageMigrationAdapter({
      database,
      lockDurationMs: 2_000,
    });
    let executionCount = 0;
    const migration = {
      id: "concurrent-run",
      version: 1,
      description: "Concurrent migration",
      up: async () => {
        executionCount++;
        await new Promise((resolve) => setTimeout(resolve, 75));
      },
    };

    const results = await Promise.all([
      adapterA.runMigrations([migration]),
      adapterB.runMigrations([migration]),
    ]);

    expect(executionCount).toBe(1);
    expect(results.filter(({ applied }) => applied.length === 1)).toHaveLength(1);
    expect(results.filter(({ skipped }) => skipped.includes(1))).toHaveLength(1);
    expect(results.map(({ currentVersion }) => currentVersion)).toEqual([1, 1]);
  });
});
