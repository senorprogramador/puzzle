import { MongoClient, MongoServerError } from "mongodb";
import { MongoStorageAdapter } from "@puzzle-ui/storage-mongodb";

import { getEnvironmentVariable } from "./environment";

type Connection = {
  client: MongoClient;
  storage: MongoStorageAdapter;
};

// Dev servers re-run modules after edits. Keeping the connection on
// globalThis reuses one connection pool per process.
const cache = globalThis as typeof globalThis & {
  puzzleDatabase?: Promise<Connection>;
};

const connect = async (): Promise<Connection> => {
  const uri = getEnvironmentVariable("MONGODB_URI");

  if (!uri) {
    throw new Error("Missing server configuration: MONGODB_URI");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const storage = new MongoStorageAdapter({
      database: client.db(getEnvironmentVariable("MONGODB_DATABASE")),
      client,
      // Auth needs all-or-nothing writes, which require a replica set.
      transactionsEnabled: true,
    });

    return { client, storage };
  } catch (error) {
    await client.close();

    if (error instanceof MongoServerError && error.code === 18) {
      throw new Error(
        "MongoDB authentication failed. For the generated local database, run the db:setup package script. Existing volumes keep their users and passwords: restore the matching .env credentials or update the user as an administrator. Also check for shell variables overriding .env. No data should be deleted to fix authentication.",
        { cause: error },
      );
    }

    throw error;
  }
};

export const getStorage = async (): Promise<MongoStorageAdapter> => {
  cache.puzzleDatabase ??= connect().catch((error: unknown) => {
    cache.puzzleDatabase = undefined;
    throw error;
  });

  return (await cache.puzzleDatabase).storage;
};
