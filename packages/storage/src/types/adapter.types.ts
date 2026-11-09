import type { StorageCollection, StorageRecord } from "./collection.types";
import type { StorageCapabilities } from "./capabilities.types";
import type { StorageQuery } from "./query.types";

export type StorageInsert<T extends StorageRecord> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type StorageUpdate<T extends StorageRecord> = Partial<Omit<T, "id" | "createdAt">>;

export type StorageBatchOperation<T extends StorageRecord> =
  | { readonly type: "insert"; readonly collection: StorageCollection; readonly record: StorageInsert<T> }
  | { readonly type: "update"; readonly collection: StorageCollection; readonly id: string; readonly expectedUpdatedAt?: Date; readonly changes: StorageUpdate<T> }
  | { readonly type: "delete"; readonly collection: StorageCollection; readonly id: string };

export interface StorageAdapter {
  readonly capabilities: StorageCapabilities;
  findById<T extends StorageRecord>(collection: StorageCollection, id: string): Promise<T | null>;
  findOne<T extends StorageRecord>(collection: StorageCollection, query: StorageQuery<T>): Promise<T | null>;
  findMany<T extends StorageRecord>(collection: StorageCollection, query?: StorageQuery<T>): Promise<readonly T[]>;
  insert<T extends StorageRecord>(collection: StorageCollection, record: StorageInsert<T>): Promise<T>;
  upsert<T extends StorageRecord>(collection: StorageCollection, query: StorageQuery<T>, record: StorageInsert<T>): Promise<T>;
  update<T extends StorageRecord>(collection: StorageCollection, id: string, changes: StorageUpdate<T>, expectedUpdatedAt?: Date): Promise<T | null>;
  delete<T extends StorageRecord>(collection: StorageCollection, id: string): Promise<boolean>;
  atomicBatch<T extends StorageRecord>(operations: readonly StorageBatchOperation<T>[]): Promise<void>;
}
