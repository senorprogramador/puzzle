import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { MongoClient } from "mongodb";
import type { StorageRecord } from "@puzzle-ui/storage";

import {
  runStorageAdapterConformance,
  runStorageMigrationConformance,
} from "../../storage/tests/conformance";

import { MongoStorageAdapter } from "../src/mongodb.adapter";
import { MongoStorageMigrationAdapter } from "../src/mongodb.migrations";

const uri = process.env.MONGODB_TEST_URI;
const databaseName = process.env.MONGODB_TEST_DATABASE ?? "puzzle_storage_test";

describe.skipIf(!uri)("MongoDB storage conformance", () => {
  let client: MongoClient;
  let database: ReturnType<MongoClient["db"]>;

  beforeAll(async () => {
    if (!uri) {
      throw new Error(
        "MONGODB_TEST_URI is required for MongoDB conformance tests.",
      );
    }

    client = new MongoClient(uri);
    await client.connect();
    database = client.db(databaseName);
  });

  afterAll(async () => {
    await client.close();
  });

  const reset = async () => {
    const collections = await database.listCollections().toArray();

    await Promise.all(
      collections
        .filter(({ name }) => name.startsWith("puzzle_"))
        .map(({ name }) => database.collection(name).deleteMany({})),
    );
  };

  runStorageAdapterConformance({
    createAdapter: async () => {
      const adapter = new MongoStorageAdapter({
        database,
        client,
        transactionsEnabled: process.env.MONGODB_TEST_TRANSACTIONS === "true",
      });

      await adapter.registerCollection({
        name: "conformance_users",
      });

      return adapter;
    },
    reset,
  });

  runStorageMigrationConformance({
    createMigrationAdapter: async () =>
      new MongoStorageMigrationAdapter({ database }),
    reset,
  });

  describe("MongoDB migration-specific conformance", () => {
    it("creates collection indexes with the configured options", async () => {
      await reset();

      const adapter = new MongoStorageAdapter({
        database,
        client,
        transactionsEnabled: false,
      });

      await adapter.registerCollection<
        StorageRecord & { email: string; expiresAt: Date }
      >({
        name: "index_conformance",
        indexes: [
          {
            name: "email_unique",
            fields: ["email"],
            unique: true,
          },
          {
            name: "expires_at_ttl",
            fields: ["expiresAt"],
            expireAfterSeconds: 0,
          },
        ],
      });

      const indexes = await database
        .collection("puzzle_index_conformance")
        .listIndexes()
        .toArray();

      const emailIndex = indexes.find(({ name }) => name === "email_unique");

      const ttlIndex = indexes.find(({ name }) => name === "expires_at_ttl");

      expect(emailIndex).toMatchObject({
        key: { email: 1 },
        unique: true,
      });

      expect(ttlIndex).toMatchObject({
        key: { expiresAt: 1 },
        expireAfterSeconds: 0,
      });
    });

    it("creates indexes through migration operations", async () => {
      await reset();

      const adapter = new MongoStorageMigrationAdapter({
        database,
      });

      await adapter.runMigrations([
        {
          id: "create-indexes",
          version: 1,
          description: "Create migration indexes",
          up: async ({ execute }) => {
            await execute({
              type: "createCollection",
              collection: "migration_index_conformance",
            });

            await execute({
              type: "createIndex",
              collection: "migration_index_conformance",
              name: "email_unique",
              fields: ["email"],
              unique: true,
            });

            await execute({
              type: "createIndex",
              collection: "migration_index_conformance",
              name: "expires_at_ttl",
              fields: ["expiresAt"],
              expireAfterSeconds: 0,
            });
          },
        },
      ]);

      const indexes = await database
        .collection("puzzle_migration_index_conformance")
        .listIndexes()
        .toArray();

      expect(indexes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "email_unique",
            key: { email: 1 },
            unique: true,
          }),
          expect.objectContaining({
            name: "expires_at_ttl",
            key: { expiresAt: 1 },
            expireAfterSeconds: 0,
          }),
        ]),
      );
    });

    it("recovers when a previous migration lock has expired", async () => {
      await reset();

      const locks = database.collection<{
        _id: string;
        owner: string;
        expiresAt: Date;
      }>("puzzle_migration_locks");

      await locks.updateOne(
        { _id: "global" },
        {
          $set: {
            owner: "abandoned-migration-runner",
            expiresAt: new Date(Date.now() - 60_000),
          },
        },
        { upsert: true },
      );

      const adapter = new MongoStorageMigrationAdapter({
        database,
        lockDurationMs: 1_000,
      });

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

      expect(await locks.findOne({ _id: "global" })).toBeNull();
    });
  });
});
