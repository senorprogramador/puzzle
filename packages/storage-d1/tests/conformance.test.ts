import { afterAll, beforeAll } from "bun:test";
import { Miniflare } from "miniflare";

import { D1StorageMigrationAdapter, D1StorageAdapter } from "../src";
import type { D1DatabaseLike } from "../src/d1.types";

import {
  runStorageAdapterConformance,
  runStorageMigrationConformance,
} from "../../storage/tests/conformance";

let miniflare: Miniflare;
let storageDatabase: D1DatabaseLike;
let migrationDatabase: D1DatabaseLike;

const resetDatabase = async (
  database: D1DatabaseLike,
  allowedPrefixes: string[],
) => {
  const result = await database
    .prepare(
      `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
    `,
    )
    .all<{ name: string }>();

  const tables = (result.results ?? []).filter(({ name }) =>
    allowedPrefixes.some((prefix) => name.startsWith(prefix)),
  );

  for (const { name } of tables) {
    const escapedName = name.replaceAll('"', '""');

    await database.prepare(`DROP TABLE IF EXISTS "${escapedName}"`).run();
  }
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
  await resetDatabase(storageDatabase, ["puzzle_conformance_"]);
  await resetDatabase(migrationDatabase, ["puzzle_migrations"]);
  await miniflare?.dispose();
});

runStorageAdapterConformance({
  createAdapter: async () =>
    new D1StorageAdapter({
      database: storageDatabase,
      tablePrefix: "puzzle_conformance",
    }),

  reset: () => resetDatabase(storageDatabase, ["puzzle_conformance_"]),
});

runStorageMigrationConformance({
  createMigrationAdapter: async () =>
    new D1StorageMigrationAdapter({
      database: migrationDatabase,
    }),

  reset: () => resetDatabase(migrationDatabase, ["puzzle_migrations"]),
});
