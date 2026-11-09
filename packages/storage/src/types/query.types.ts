export type StorageScalar = string | number | boolean | Date | null;

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
  readonly [K in keyof T]?: StorageComparison<T[K] extends StorageScalar ? T[K] : StorageScalar>;
} & {
  readonly and?: readonly StorageWhere<T>[];
  readonly or?: readonly StorageWhere<T>[];
};

export type StorageQuery<T extends object> = {
  readonly where?: StorageWhere<T>;
  readonly orderBy?: readonly { readonly field: keyof T; readonly direction: "asc" | "desc" }[];
  readonly limit?: number;
  readonly offset?: number;
};
