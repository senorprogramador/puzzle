import type { Db, MongoClient } from "mongodb";

export type MongoStorageAdapterOptions = {
  readonly database: Db;
  readonly client?: MongoClient;
  readonly collectionPrefix?: string;
  readonly transactionsEnabled?: boolean;
};

export type MongoStorageMigrationOptions = {
  readonly database: Db;
  readonly collectionPrefix?: string;
  readonly lockDurationMs?: number;
};
