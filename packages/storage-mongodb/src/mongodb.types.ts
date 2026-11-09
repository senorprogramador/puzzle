export type MongoDatabaseLike = {
  collection<TSchema extends Record<string, unknown> = Record<string, unknown>>(name: string): unknown;
};

export type MongoStorageAdapterOptions = {
  readonly database: MongoDatabaseLike;
  readonly collectionPrefix?: string;
};
