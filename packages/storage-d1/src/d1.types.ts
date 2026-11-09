export type D1ResultLike<T = unknown> = {
  readonly results?: readonly T[];
  readonly success: boolean;
  readonly meta?: Readonly<Record<string, unknown>>;
};

export type D1PreparedStatementLike = {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = unknown>(columnName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1ResultLike<T>>;
  run<T = unknown>(): Promise<D1ResultLike<T>>;
};

export type D1DatabaseLike = {
  prepare(query: string): D1PreparedStatementLike;
  batch<T = unknown>(
    statements: readonly D1PreparedStatementLike[],
  ): Promise<readonly D1ResultLike<T>[]>;
};

export type D1StorageAdapterOptions = {
  readonly database: D1DatabaseLike;
  readonly tablePrefix?: string;
};

export type D1StorageMigrationOptions = {
  readonly database: D1DatabaseLike;
  readonly tablePrefix?: string;
  readonly lockDurationMs?: number;
};
