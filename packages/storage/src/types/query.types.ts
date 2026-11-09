import type { StorageRecord, StorageScalar } from "./collection.types";

export type StorageComparison<T = StorageScalar> =
  | { readonly operator: "eq"; readonly value: T }
  | { readonly operator: "ne"; readonly value: T }
  | { readonly operator: "in"; readonly value: readonly T[] }
  | { readonly operator: "notIn"; readonly value: readonly T[] }
  | { readonly operator: "gt"; readonly value: T }
  | { readonly operator: "gte"; readonly value: T }
  | { readonly operator: "lt"; readonly value: T }
  | { readonly operator: "lte"; readonly value: T }
  | { readonly operator: "exists"; readonly value: boolean };

export type StorageWhere<T extends object> = {
  readonly [K in keyof T]?: T[K] extends StorageScalar
    ? StorageComparison<T[K]>
    : StorageComparison<StorageScalar>;
} & {
  readonly and?: readonly StorageWhere<T>[];
  readonly or?: readonly StorageWhere<T>[];
};

export type StorageOrder<T extends object> = {
  readonly field: keyof T & string;
  readonly direction: "asc" | "desc";
};

export type StorageQuery<T extends StorageRecord> = {
  readonly where?: StorageWhere<T>;
  readonly orderBy?: readonly StorageOrder<T>[];
  readonly limit?: number;
  readonly offset?: number;
};

export type StorageCursor = {
  readonly value: string;
};

export type StorageCursorQuery<T extends StorageRecord> = Omit<
  StorageQuery<T>,
  "offset"
> & {
  readonly first: number;
  readonly after?: StorageCursor;
};

export type StoragePage<T extends StorageRecord> = {
  readonly items: readonly T[];
  readonly nextCursor: StorageCursor | null;
  readonly hasNextPage: boolean;
};
