import type { StorageRecord, StorageScalar } from "./collection.types";

type StorageFieldPathDepth = readonly unknown[];

export type StorageFieldPath<
  T extends object,
  Depth extends StorageFieldPathDepth = [],
> = Depth["length"] extends 6
  ? never
  : {
      [K in keyof T & string]: NonNullable<T[K]> extends StorageScalar
        ? K
        : NonNullable<T[K]> extends readonly (infer Item)[]
          ? [Item] extends [StorageScalar]
            ? K
            : never
          : NonNullable<T[K]> extends object
            ? `${K}.${StorageFieldPath<
                NonNullable<T[K]>,
                [...Depth, unknown]
              >}`
            : never;
    }[keyof T & string];

export type StorageScalarFieldPath<
  T extends object,
  Depth extends StorageFieldPathDepth = [],
> = Depth["length"] extends 6
  ? never
  : {
      [K in keyof T & string]: NonNullable<T[K]> extends StorageScalar
        ? K
        : NonNullable<T[K]> extends readonly unknown[]
          ? never
          : NonNullable<T[K]> extends object
            ? `${K}.${StorageScalarFieldPath<
                NonNullable<T[K]>,
                [...Depth, unknown]
              >}`
            : never;
    }[keyof T & string];

export type StorageFieldValue<T, Path extends string> = Path extends
  `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? StorageFieldValue<NonNullable<T[Key]>, Rest>
    : StorageScalar
  : Path extends keyof T
    ? T[Path]
    : StorageScalar;

export type StorageComparison<T = StorageScalar> =
  | { readonly operator: "eq"; readonly value: T }
  | { readonly operator: "ne"; readonly value: T }
  | { readonly operator: "contains"; readonly value: StorageScalar }
  | { readonly operator: "in"; readonly value: readonly T[] }
  | { readonly operator: "notIn"; readonly value: readonly T[] }
  | { readonly operator: "gt"; readonly value: T }
  | { readonly operator: "gte"; readonly value: T }
  | { readonly operator: "lt"; readonly value: T }
  | { readonly operator: "lte"; readonly value: T }
  | { readonly operator: "exists"; readonly value: boolean };

type StorageComparisonFor<Value> =
  NonNullable<Value> extends readonly (infer Item)[]
    ? [Item] extends [StorageScalar]
      ? { readonly operator: "contains"; readonly value: Item }
      : never
    : NonNullable<Value> extends StorageScalar
    ? StorageComparison<Extract<Value, StorageScalar>>
    : never;

export type StorageWhere<T extends object> = {
  readonly [K in StorageFieldPath<T>]?: StorageComparisonFor<
    StorageFieldValue<T, K>
  >;
} & {
  readonly and?: readonly StorageWhere<T>[];
  readonly or?: readonly StorageWhere<T>[];
};

export type StorageOrder<T extends object> = {
  readonly field: StorageScalarFieldPath<T>;
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
