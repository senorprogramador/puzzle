import {
  type Document,
  type Filter,
  type MongoServerError,
  type Sort,
  type UpdateFilter,
  type WithId,
} from "mongodb";

import {
  StorageAtomicityError,
  StorageConflictError,
  StorageDuplicateError,
  StorageValidationError,
  type StorageAdapter,
  type StorageBatchOperation,
  type StorageBatchResult,
  type StorageCollection,
  type StorageCollectionName,
  type StorageCondition,
  type StorageCursor,
  type StorageCursorQuery,
  type StoragePage,
  type StorageQuery,
  type StorageRecord,
  type StorageUpdate,
  type StorageWhere,
  type StorageCapabilities,
  type StorageCapabilityReport,
  validateQuery,
  type StorageInsert,
} from "@puzzle-ui/storage";

import type { MongoStorageAdapterOptions } from "./mongodb.types";

type MongoRecord = Document & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  revision: number;
};

type CursorPayload = {
  readonly values: readonly unknown[];
};

const isDuplicateError = (error: unknown): error is MongoServerError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as MongoServerError).code === 11000;

const mapMongoError = (error: unknown): never => {
  if (isDuplicateError(error)) {
    throw new StorageDuplicateError("mongodb_unique_constraint");
  }

  throw error;
};

const toMongoField = (field: string) => (field === "id" ? "_id" : field);

const toMongoValue = (value: unknown) =>
  value instanceof Date ? value : value;

const encodeCursor = (payload: CursorPayload): StorageCursor => ({
  value: Buffer.from(JSON.stringify(payload)).toString("base64url"),
});

const decodeCursor = (cursor: StorageCursor): CursorPayload => {
  try {
    return JSON.parse(
      Buffer.from(cursor.value, "base64url").toString("utf8"),
    ) as CursorPayload;
  } catch {
    throw new StorageValidationError("Invalid MongoDB cursor.");
  }
};

const toRecord = <T extends StorageRecord>(
  document: WithId<MongoRecord> | null,
): T | null => {
  if (!document) return null;

  const { _id, ...data } = document;

  return {
    ...data,
    id: String(_id),
  } as T;
};

const toDocument = <T extends StorageRecord>(
  record: Partial<T> & { id: string },
): MongoRecord => {
  const { id, createdAt, updatedAt, revision, ...data } =
    record as StorageRecord & Document;

  const now = new Date();

  return {
    ...data,
    _id: id,
    createdAt: createdAt ?? now,
    updatedAt: updatedAt ?? now,
    revision: revision ?? 1,
  };
};

const toMongoWhere = <T extends object>(
  where?: StorageWhere<T>,
): Filter<MongoRecord> => {
  if (!where) return {};

  const result: Filter<MongoRecord>[] = [];

  for (const [field, comparison] of Object.entries(where)) {
    if (field === "and" || field === "or") {
      const nested = (comparison as readonly StorageWhere<T>[]).map((item) =>
        toMongoWhere(item),
      );

      result.push({
        [field === "and" ? "$and" : "$or"]: nested,
      });

      continue;
    }

    const value: unknown = comparison;

    if (
      typeof value !== "object" ||
      value === null ||
      !("operator" in value) ||
      typeof value.operator !== "string" ||
      !("value" in value)
    ) {
      throw new StorageValidationError(
        `Invalid query comparison for field: ${field}`,
      );
    }

    const mongoField = toMongoField(field);

    const operators: Record<string, string> = {
      eq: "$eq",
      ne: "$ne",
      in: "$in",
      notIn: "$nin",
      gt: "$gt",
      gte: "$gte",
      lt: "$lt",
      lte: "$lte",
      exists: "$exists",
    };

    const operator = operators[value.operator];

    if (!operator) {
      throw new StorageValidationError(
        `Unsupported query operator: ${value.operator}`,
      );
    }

    result.push({
      [mongoField]: {
        [operator]: value.value,
      },
    });
  }

  if (result.length === 0) return {};
  if (result.length === 1) return result[0]!;

  return { $and: result };
};

const toMongoSort = <T extends StorageRecord>(
  orderBy?: StorageQuery<T>["orderBy"],
): Sort => {
  const sort: Record<string, 1 | -1> = {};

  for (const item of orderBy ?? []) {
    sort[toMongoField(String(item.field))] = item.direction === "asc" ? 1 : -1;
  }

  if (!("_id" in sort)) {
    sort._id = 1;
  }

  return sort;
};

const toCursorFilter = <T extends StorageRecord>(
  orderBy: NonNullable<StorageQuery<T>["orderBy"]>,
  values: readonly unknown[],
): Filter<MongoRecord> => {
  const fields = [
    ...orderBy.map((item) => ({
      field: toMongoField(String(item.field)),
      direction: item.direction,
    })),
  ];

  if (!fields.some((item) => item.field === "_id")) {
    fields.push({ field: "_id", direction: "asc" });
  }

  const branches: Filter<MongoRecord>[] = [];

  for (let index = 0; index < fields.length; index++) {
    const prefix: Filter<MongoRecord>[] = [];

    for (let previous = 0; previous < index; previous++) {
      prefix.push({
        [fields[previous]!.field]: values[previous],
      });
    }

    const field = fields[index]!;
    const operator = field.direction === "asc" ? "$gt" : "$lt";

    branches.push({
      $and: [
        ...prefix,
        {
          [field.field]: {
            [operator]: values[index],
          },
        },
      ],
    });
  }

  return { $or: branches };
};

const buildCondition = (condition?: StorageCondition): Document => {
  if (!condition) return {};

  const result: Document = {};

  if (condition.expectedRevision !== undefined) {
    result.revision = condition.expectedRevision;
  }

  if (condition.expectedUpdatedAt !== undefined) {
    result.updatedAt = condition.expectedUpdatedAt;
  }

  return result;
};

const cleanChanges = <T extends StorageRecord>(
  changes: StorageUpdate<T>,
): Document => {
  const result = { ...changes } as Document;

  delete result.id;
  delete result.createdAt;
  delete result.updatedAt;
  delete result.revision;

  return result;
};

export class MongoStorageAdapter implements StorageAdapter {
  readonly capabilities: StorageCapabilities;

  private readonly database: MongoStorageAdapterOptions["database"];
  private readonly client: MongoStorageAdapterOptions["client"];
  private readonly prefix: string;

  constructor(options: MongoStorageAdapterOptions) {
    this.database = options.database;
    this.client = options.client;
    this.prefix = options.collectionPrefix ?? "puzzle_";

    const transactionsEnabled =
      options.transactionsEnabled === true && !!options.client;

    this.capabilities = {
      transactions: transactionsEnabled,
      atomicBatch: transactionsEnabled,
      conditionalWrites: true,
      uniqueConstraints: true,
      upsert: true,
      cursorPagination: true,
      migrations: true,
      ttlIndexes: true,
    };
  }

  getCapabilities(): StorageCapabilityReport {
    const limitations = this.capabilities.transactions
      ? []
      : [
          "Multi-document transactions are disabled. Configure a replica set or sharded deployment and set transactionsEnabled to true.",
        ];

    return {
      capabilities: this.capabilities,
      limitations,
    };
  }

  private collection<T extends StorageRecord>(name: StorageCollectionName) {
    return this.database.collection<MongoRecord>(`${this.prefix}${name}`);
  }

  async registerCollection<T extends StorageRecord>(
    definition: StorageCollection<T>,
  ): Promise<void> {
    const collectionName = `${this.prefix}${definition.name}`;

    try {
      await this.database.createCollection(collectionName);
    } catch (error) {
      if (
        !(
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as { code: number }).code === 48
        )
      ) {
        throw error;
      }
    }

    const collection = this.database.collection(collectionName);

    const indexes = (definition.indexes ?? []).map((index) => ({
      key: Object.fromEntries(
        index.fields.map((field) => [toMongoField(String(field)), 1]),
      ),
      name: index.name,
      unique: index.unique ?? false,
      ...(index.expireAfterSeconds !== undefined
        ? { expireAfterSeconds: index.expireAfterSeconds }
        : {}),
    }));

    if (indexes.length > 0) {
      await collection.createIndexes(indexes);
    }
  }

  async findById<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
  ): Promise<T | null> {
    const document = await this.collection(collection).findOne({
      _id: id,
    });

    return toRecord<T>(document);
  }

  async findOne<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<T | null> {
    validateQuery(query);

    const document = await this.collection(collection).findOne(
      toMongoWhere(query.where),
      {
        sort: toMongoSort(query.orderBy),
        ...(query.offset !== undefined ? { skip: query.offset } : {}),
      },
    );

    return toRecord<T>(document);
  }

  async findMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T> = {},
  ): Promise<readonly T[]> {
    validateQuery(query);

    const documents = await this.collection(collection)
      .find(toMongoWhere(query.where))
      .sort(toMongoSort(query.orderBy))
      .skip(query.offset ?? 0)
      .limit(query.limit ?? 0)
      .toArray();

    return documents.map((document) => toRecord<T>(document) as T);
  }

  async findPage<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageCursorQuery<T>,
  ): Promise<StoragePage<T>> {
    if (!Number.isInteger(query.first) || query.first < 1) {
      throw new StorageValidationError(
        "Cursor page size must be a positive integer.",
      );
    }

    const orderBy = query.orderBy ?? [
      { field: "id" as keyof T & string, direction: "asc" as const },
    ];

    let filter = toMongoWhere(query.where);

    if (query.after) {
      const payload = decodeCursor(query.after);

      const cursorFilter = toCursorFilter(orderBy, payload.values);

      filter = Object.keys(filter).length
        ? { $and: [filter, cursorFilter] }
        : cursorFilter;
    }

    const sort = toMongoSort(orderBy);

    const documents = await this.collection(collection)
      .find(filter)
      .sort(sort)
      .limit(query.first + 1)
      .toArray();

    const hasNextPage = documents.length > query.first;
    const items = documents.slice(0, query.first);
    const last = items.at(-1);

    const cursorFields = [
      ...orderBy.map((item) => toMongoField(String(item.field))),
    ];

    if (!cursorFields.includes("_id")) cursorFields.push("_id");

    const nextCursor =
      hasNextPage && last
        ? encodeCursor({
            values: cursorFields.map((field) =>
              field === "_id" ? last._id : last[field],
            ),
          })
        : null;

    return {
      items: items.map((item) => toRecord<T>(item) as T),
      hasNextPage,
      nextCursor,
    };
  }

  async insert<T extends StorageRecord>(
    collection: StorageCollectionName,
    record: Parameters<StorageAdapter["insert"]>[1],
  ): Promise<T> {
    const document = toDocument(record as StorageRecord & { id: string });

    try {
      await this.collection(collection).insertOne(document);
      return toRecord<T>(document as WithId<MongoRecord>) as T;
    } catch (error) {
      return mapMongoError(error);
    }
  }

  async upsert<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
    record: StorageInsert<T>,
  ): Promise<T> {
    validateQuery(query);

    const existing = await this.findOne<T>(collection, query);

    if (existing) {
      const updated = await this.update<T>(
        collection,
        existing.id,
        record as StorageUpdate<T>,
      );

      return updated ?? existing;
    }

    return this.insert<T>(collection, record);
  }

  async update<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
    changes: StorageUpdate<T>,
    condition?: StorageCondition,
  ): Promise<T | null> {
    const target = this.collection(collection);

    const filter = {
      _id: id,
      ...buildCondition(condition),
    };

    const update: UpdateFilter<MongoRecord> = {
      $set: {
        ...cleanChanges(changes),
        updatedAt: new Date(),
      },
      $inc: { revision: 1 },
    };

    const result = await target.updateOne(filter, update);

    if (result.matchedCount === 0) {
      if (condition && (await target.findOne({ _id: id }))) {
        throw new StorageConflictError();
      }

      return null;
    }

    return toRecord<T>(await target.findOne({ _id: id }));
  }

  async updateMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
    changes: StorageUpdate<T>,
  ): Promise<number> {
    validateQuery(query);

    const result = await this.collection(collection).updateMany(
      toMongoWhere(query.where),
      {
        $set: {
          ...cleanChanges(changes),
          updatedAt: new Date(),
        },
        $inc: { revision: 1 },
      },
    );

    return result.modifiedCount;
  }

  async delete<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
    condition?: StorageCondition,
  ): Promise<boolean> {
    const target = this.collection(collection);

    const result = await target.deleteOne({
      _id: id,
      ...buildCondition(condition),
    });

    if (result.deletedCount > 0) return true;

    if (condition && (await target.findOne({ _id: id }))) {
      throw new StorageConflictError();
    }

    return false;
  }

  async deleteMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<number> {
    validateQuery(query);

    const result = await this.collection(collection).deleteMany(
      toMongoWhere(query.where),
    );

    return result.deletedCount;
  }

  async exists<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<boolean> {
    validateQuery(query);

    return (
      (await this.collection(collection).findOne(toMongoWhere(query.where), {
        projection: { _id: 1 },
      })) !== null
    );
  }

  async count<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T> = {},
  ): Promise<number> {
    validateQuery(query);

    return this.collection(collection).countDocuments(
      toMongoWhere(query.where),
    );
  }

  async atomicBatch<T extends StorageRecord>(
    operations: readonly StorageBatchOperation<T>[],
  ): Promise<StorageBatchResult<T>> {
    if (!this.capabilities.atomicBatch || !this.client) {
      throw new StorageAtomicityError(
        "MongoDB atomicBatch requires an explicitly enabled transaction-capable deployment.",
      );
    }

    const session = this.client.startSession();
    const results: StorageBatchResult<T>["results"][number][] = [];

    try {
      await session.withTransaction(async () => {
        results.length = 0;

        for (const operation of operations) {
          const target = this.collection(operation.collection);

          if (operation.type === "insert") {
            const document = toDocument(
              operation.record as StorageRecord & { id: string },
            );

            await target.insertOne(document, { session });

            results.push({
              type: "insert",
              record: toRecord<T>(document as WithId<MongoRecord>) as T,
            });

            continue;
          }

          if (operation.type === "update") {
            const result = await target.updateOne(
              {
                _id: operation.id,
                ...buildCondition(operation.condition),
              },
              {
                $set: {
                  ...cleanChanges(operation.changes),
                  updatedAt: new Date(),
                },
                $inc: { revision: 1 },
              },
              { session },
            );

            if (result.matchedCount === 0 && operation.condition) {
              throw new StorageConflictError();
            }

            const updated = await target.findOne(
              { _id: operation.id },
              { session },
            );

            results.push({
              type: "update",
              record: toRecord<T>(updated),
            });

            continue;
          }

          const result = await target.deleteOne(
            {
              _id: operation.id,
              ...buildCondition(operation.condition),
            },
            { session },
          );

          if (
            result.deletedCount === 0 &&
            operation.condition &&
            (await target.findOne({ _id: operation.id }, { session }))
          ) {
            throw new StorageConflictError();
          }

          results.push({
            type: "delete",
            deleted: result.deletedCount > 0,
          });
        }
      });

      return { results };
    } catch (error) {
      if (
        error instanceof StorageConflictError ||
        error instanceof StorageAtomicityError
      ) {
        throw error;
      }

      if (isDuplicateError(error)) {
        throw new StorageDuplicateError("mongodb_unique_constraint");
      }

      throw error;
    } finally {
      await session.endSession();
    }
  }
}
