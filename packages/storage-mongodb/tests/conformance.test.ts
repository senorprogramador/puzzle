import { afterAll, beforeAll, describe } from "bun:test";
import { MongoClient } from "mongodb";

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
      throw new Error("MONGODB_TEST_URI is required for MongoDB conformance tests.");
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
});
