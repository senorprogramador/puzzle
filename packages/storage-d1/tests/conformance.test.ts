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

describe("D1 migration-specific conformance", () => {
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
