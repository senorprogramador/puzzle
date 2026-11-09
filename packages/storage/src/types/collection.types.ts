export type StorageScalar = string | number | boolean | Date | null;

export type StorageRecord = {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly revokedAt?: Date | null;
  readonly revision: number;
};

export type StorageCollectionName = string;

export type StorageField<T> = {
  [K in keyof T]-?: T[K] extends StorageScalar ? K : never;
}[keyof T] &
  string;

export type StorageCollectionOptions<T extends StorageRecord> = {
  readonly name: StorageCollectionName;
  readonly schema?: StorageSchema<T>;
  readonly indexes?: readonly StorageIndex<T>[];
};

export type StorageCollection<T extends StorageRecord> =
  StorageCollectionOptions<T>;

export type StorageSchema<T extends StorageRecord> = {
  readonly validate: (record: unknown) => record is T;
};

export type StorageIndex<T extends StorageRecord> = {
  readonly name: string;
  readonly fields: readonly StorageField<T>[];
  readonly unique?: boolean;
  readonly expireAfterSeconds?: number;
};
