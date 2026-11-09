import { afterAll, beforeAll } from "bun:test";
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
