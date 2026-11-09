import type { StorageCollection, StorageRecord } from "./collection.types";

export type StorageSchemaRegistry = {
  readonly collections: readonly StorageCollection<StorageRecord>[];
};

export type StorageIndexDefinition = {
  readonly name: string;
  readonly collection: string;
  readonly fields: readonly string[];
  readonly unique?: boolean;
  readonly expireAfterSeconds?: number;
};

export type StorageSchemaAdapter = {
  ensureCollection<T extends StorageRecord>(
    collection: StorageCollection<T>,
  ): Promise<void>;

  ensureIndex(index: StorageIndexDefinition): Promise<void>;

  listIndexes(collection: string): Promise<readonly StorageIndexDefinition[]>;
};
