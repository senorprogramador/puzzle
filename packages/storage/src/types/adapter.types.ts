import type {
  StorageCollection,
  StorageCollectionName,
  StorageRecord,
} from "./collection.types";
import type {
  StorageCapabilityReport,
  StorageCapabilities,
} from "./capabilities.types";
import type {
  StorageCursorQuery,
  StoragePage,
  StorageQuery,
} from "./query.types";

export type StorageInsert<T extends StorageRecord> = Omit<
  T,
  "createdAt" | "updatedAt" | "revision"
> & {
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly revision?: number;
};

export type StorageUpdate<T extends StorageRecord> = Partial<
  Omit<T, "id" | "createdAt" | "revision">
>;

export type StorageCondition = {
  readonly expectedRevision?: number;
  readonly expectedUpdatedAt?: Date;
};

export type StorageBatchOperation<T extends StorageRecord> =
  | {
      readonly type: "insert";
      readonly collection: StorageCollectionName;
      readonly record: StorageInsert<T>;
    }
  | {
      readonly type: "update";
      readonly collection: StorageCollectionName;
      readonly id: string;
      readonly condition?: StorageCondition;
      readonly changes: StorageUpdate<T>;
    }
  | {
      readonly type: "delete";
      readonly collection: StorageCollectionName;
      readonly id: string;
      readonly condition?: StorageCondition;
    };

export type StorageBatchResult<T extends StorageRecord> = {
  readonly results: readonly (
    | { readonly type: "insert"; readonly record: T }
    | { readonly type: "update"; readonly record: T | null }
    | { readonly type: "delete"; readonly deleted: boolean }
  )[];
};

export type StorageAdapterOptions = {
  readonly requireAtomicBatch?: boolean;
};

export interface StorageAdapter {
  readonly capabilities: StorageCapabilities;

  getCapabilities(): StorageCapabilityReport;

  registerCollection<T extends StorageRecord>(
    collection: StorageCollection<T>,
  ): Promise<void>;

  findById<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
  ): Promise<T | null>;

  findOne<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<T | null>;

  findMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query?: StorageQuery<T>,
  ): Promise<readonly T[]>;

  findPage<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageCursorQuery<T>,
  ): Promise<StoragePage<T>>;

  insert<T extends StorageRecord>(
    collection: StorageCollectionName,
    record: StorageInsert<T>,
  ): Promise<T>;

  upsert<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
    record: StorageInsert<T>,
  ): Promise<T>;

  update<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
    changes: StorageUpdate<T>,
    condition?: StorageCondition,
  ): Promise<T | null>;

  updateMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
    changes: StorageUpdate<T>,
  ): Promise<number>;

  delete<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
    condition?: StorageCondition,
  ): Promise<boolean>;

  deleteMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<number>;

  exists<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<boolean>;

  count<T extends StorageRecord>(
    collection: StorageCollectionName,
    query?: StorageQuery<T>,
  ): Promise<number>;

  atomicBatch<T extends StorageRecord>(
    operations: readonly StorageBatchOperation<T>[],
  ): Promise<StorageBatchResult<T>>;
}
