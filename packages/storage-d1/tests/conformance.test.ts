import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { Miniflare } from "miniflare";

import { D1StorageMigrationAdapter, D1StorageAdapter } from "../src";
import type { D1DatabaseLike } from "../src/d1.types";

import {
  runStorageAdapterConformance,
  runStorageMigrationConformance,
} from "../../storage/tests/conformance";
import { USERS_COLLECTION } from "../../storage/tests/conformance/storage-adapter.test-types";

let miniflare: Miniflare;
let storageDatabase: D1DatabaseLike;
let migrationDatabase: D1DatabaseLike;

const resetStorageDatabase = async () => {
  await storageDatabase
    .prepare('DROP TABLE IF EXISTS "puzzle_conformance_users"')
    .run();
};

const resetMigrationDatabase = async () => {
  await migrationDatabase
    .prepare('DROP TABLE IF EXISTS "puzzle_migrations"')
    .run();

  await migrationDatabase
    .prepare('DROP TABLE IF EXISTS "puzzle_migration_lock"')
    .run();
};

beforeAll(async () => {
  miniflare = new Miniflare({
    modules: true,
    script: `
      export default {
        fetch() {
          return new Response("Puzzle D1 conformance tests");
        }
      };
    `,
    d1Databases: {
      STORAGE_DB: "00000000-0000-0000-0000-000000000001",
      MIGRATIONS_DB: "00000000-0000-0000-0000-000000000002",
    },
  });

  storageDatabase = (await miniflare.getD1Database(
    "STORAGE_DB",
  )) as unknown as D1DatabaseLike;

  migrationDatabase = (await miniflare.getD1Database(
    "MIGRATIONS_DB",
  )) as unknown as D1DatabaseLike;
});

afterAll(async () => {
  await miniflare?.dispose();
});

runStorageAdapterConformance({
  createAdapter: async () => {
    const adapter = new D1StorageAdapter({
      database: storageDatabase,
      tablePrefix: "puzzle_",
    });

    await adapter.registerCollection({
      name: USERS_COLLECTION,
    });

    return adapter;
  },

  reset: resetStorageDatabase,
});

runStorageMigrationConformance({
  createMigrationAdapter: async () =>
    new D1StorageMigrationAdapter({
      database: migrationDatabase,
    }),

  reset: resetMigrationDatabase,
});

describe("D1 index names", () => {
  it("supports hyphenated index names while rejecting unsafe SQL identifiers", async () => {
    type IndexedRecord = {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      revision: number;
      tenantId: string;
      slug: string;
    };
    const adapter = new D1StorageAdapter({ database: storageDatabase });
    const definition = {
      name: "index_name_test",
      indexes: [{ name: "by-tenant-slug", fields: ["tenantId", "slug"] as const, unique: true }],
    };
    await adapter.registerCollection<IndexedRecord>(definition);
    await adapter.registerCollection<IndexedRecord>(definition);
    const first = { id: "first", tenantId: "tenant-a", slug: "hello" };
    const duplicate = { id: "second", tenantId: "tenant-a", slug: "hello" };
    await adapter.insert<IndexedRecord>(definition.name, first);
    await expect(adapter.insert<IndexedRecord>(definition.name, duplicate)).rejects.toThrow();
    await expect(adapter.registerCollection<IndexedRecord>({
      name: definition.name,
      indexes: [{ name: 'bad"; DROP TABLE test;--', fields: ["slug"] }],
    })).rejects.toThrow("Invalid SQL identifier");
    expect(await adapter.findById<IndexedRecord>(definition.name, "first")).not.toBeNull();
  });
});

describe("D1 migration-specific conformance", () => {
  it("orders migrations, honors target versions, and skips completed work", async () => {
    await resetMigrationDatabase();

    const adapter = new D1StorageMigrationAdapter({
      database: migrationDatabase,
    });
    const executionOrder: number[] = [];
    const migrations = [3, 1, 2].map((version) => ({
      id: `ordered-${version}`,
      version,
      description: `Migration ${version}`,
      up: async () => {
        executionOrder.push(version);
      },
    }));

    const first = await adapter.runMigrations(migrations, {
      targetVersion: 2,
    });
    const second = await adapter.runMigrations(migrations, {
      targetVersion: 2,
    });

    expect(executionOrder).toEqual([1, 2]);
    expect(first.applied).toEqual([1, 2]);
    expect(first.skipped).toEqual([3]);
    expect(first.currentVersion).toBe(2);
    expect(second.applied).toEqual([]);
    expect(second.skipped).toEqual([1, 2, 3]);
  });

  it("records failed migrations and releases the migration lock", async () => {
    await resetMigrationDatabase();

    const adapter = new D1StorageMigrationAdapter({
      database: migrationDatabase,
    });

    await expect(
      adapter.runMigrations([
        {
          id: "failed-and-unlocked",
          version: 1,
          description: "Failure releases the lock",
          up: async () => {
            throw new Error("migration failed");
          },
        },
      ]),
    ).rejects.toThrow("migration failed");

    expect(
      await migrationDatabase
        .prepare(
          `SELECT owner, expires_at FROM "puzzle_migration_lock" WHERE id = 1`,
        )
        .first<{ owner: string; expires_at: number }>(),
    ).toEqual({ owner: "", expires_at: 0 });

    const status = await adapter.getMigrationStatus();
    expect(status.migrations).toMatchObject([
      { id: "failed-and-unlocked", status: "failed", error: "migration failed" },
    ]);
  });

  it("serializes concurrent migration runners and applies a migration once", async () => {
    await resetMigrationDatabase();

    const adapterA = new D1StorageMigrationAdapter({
      database: migrationDatabase,
    });
    const adapterB = new D1StorageMigrationAdapter({
      database: migrationDatabase,
    });
    let executionCount = 0;

    const migration = {
      id: "d1-concurrent",
      version: 1,
      description: "Concurrent D1 migration",
      up: async () => {
        executionCount++;
        await new Promise((resolve) => setTimeout(resolve, 75));
      },
    };

    const [first, second] = await Promise.all([
      adapterA.runMigrations([migration]),
      adapterB.runMigrations([migration]),
    ]);

    expect(executionCount).toBe(1);
    expect(
      [first, second].filter(({ applied }) => applied.length === 1),
    ).toHaveLength(1);
    expect(
      [first, second].filter(({ skipped }) => skipped.includes(1)),
    ).toHaveLength(1);
    expect([first.currentVersion, second.currentVersion]).toEqual([1, 1]);
  });

  it("recovers when a previous migration lock has expired", async () => {
    await resetMigrationDatabase();

    const adapter = new D1StorageMigrationAdapter({
      database: migrationDatabase,
      lockDurationMs: 1_000,
    });

    // Laat de adapter eerst de migratietabellen initialiseren.
    await adapter.getMigrationStatus();

    await migrationDatabase
      .prepare(
        `
        UPDATE "puzzle_migration_lock"
        SET owner = ?, expires_at = ?
        WHERE id = 1
      `,
      )
      .bind("abandoned-migration-runner", Date.now() - 60_000)
      .run();

    let executionCount = 0;

    const result = await adapter.runMigrations([
      {
        id: "recover-expired-lock",
        version: 1,
        description: "Recover after an expired lock",
        up: async () => {
          executionCount++;
        },
      },
    ]);

    expect(executionCount).toBe(1);
    expect(result.applied).toEqual([1]);
    expect(result.currentVersion).toBe(1);

    const lock = await migrationDatabase
      .prepare(
        `
        SELECT owner, expires_at
        FROM "puzzle_migration_lock"
        WHERE id = 1
      `,
      )
      .first<{ owner: string; expires_at: number }>();

    expect(lock).toEqual({
      owner: "",
      expires_at: 0,
    });
  });
});

describe("D1 date fields", () => {
  type Window = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    revision: number;
    resetAt: Date;
    history: { at: Date }[];
  };

  const COLLECTION = "date_windows";

  const createAdapter = async () => {
    await storageDatabase
      .prepare('DROP TABLE IF EXISTS "puzzle_date_windows"')
      .run();

    const adapter = new D1StorageAdapter({
      database: storageDatabase,
      tablePrefix: "puzzle_",
    });

    await adapter.registerCollection<Window>({
      name: COLLECTION,
      indexes: [{ name: "reset", fields: ["resetAt"] }],
    });

    return adapter;
  };

  it("round-trips dates through insert, update and queries", async () => {
    const adapter = await createAdapter();
    const early = new Date("2026-01-01T00:00:00.000Z");
    const late = new Date("2026-06-01T00:00:00.000Z");

    await adapter.insert<Window>(COLLECTION, {
      id: "early",
      resetAt: early,
      history: [{ at: early }],
    } as unknown as Window);
    await adapter.insert<Window>(COLLECTION, {
      id: "late",
      resetAt: late,
      history: [],
    } as unknown as Window);

    const stored = await adapter.findById<Window>(COLLECTION, "early");
    expect(stored?.resetAt).toBeInstanceOf(Date);
    expect(stored?.resetAt.getTime()).toBe(early.getTime());
    expect(stored?.history[0]?.at).toBeInstanceOf(Date);

    const updated = await adapter.update<Window>(COLLECTION, "early", {
      resetAt: late,
    });
    expect(updated?.resetAt).toBeInstanceOf(Date);
    expect(updated?.resetAt.getTime()).toBe(late.getTime());

    const matches = await adapter.findMany<Window>(COLLECTION, {
      where: { resetAt: { operator: "lt", value: new Date("2026-07-01") } },
      orderBy: [{ field: "resetAt", direction: "asc" }],
    });
    expect(matches.map((item) => item.id)).toEqual(["early", "late"]);

    const exact = await adapter.findOne<Window>(COLLECTION, {
      where: { resetAt: { operator: "eq", value: late } },
    });
    expect(exact?.id).toBe("early");
  });
});
