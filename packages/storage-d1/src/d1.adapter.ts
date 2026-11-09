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
} from "@puzzle-ui/storage";

import type {
  D1DatabaseLike,
  D1PreparedStatementLike,
  D1ResultLike,
  D1StorageAdapterOptions,
} from "./d1.types";

type D1Row = {
  id: string;
  created_at: string;
  updated_at: string;
  revision: number;
  data: string;
};

type CursorPayload = {
  readonly values: readonly unknown[];
};

const DATE_MARKER = "__puzzle_storage_date__";

const serialize = (value: unknown): string =>
  JSON.stringify(value, (_key, current: unknown) =>
    current instanceof Date
      ? { [DATE_MARKER]: current.toISOString() }
      : current,
  );

const deserialize = <T>(value: string): T =>
  JSON.parse(value, (_key, current: unknown) => {
    if (
      typeof current === "object" &&
      current !== null &&
      DATE_MARKER in current
    ) {
      const date = current[DATE_MARKER];

      if (typeof date !== "string") {
        throw new StorageValidationError("Invalid serialized D1 date.");
      }

      return new Date(date);
    }

    return current;
  }) as T;

const encodeCursor = (payload: CursorPayload): StorageCursor => ({
  value: btoa(encodeURIComponent(JSON.stringify(payload))),
});

const decodeCursor = (cursor: StorageCursor): CursorPayload => {
  try {
    return JSON.parse(decodeURIComponent(atob(cursor.value))) as CursorPayload;
  } catch {
    throw new StorageValidationError("Invalid D1 cursor.");
  }
};

const quoteIdentifier = (value: string): string => {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
    throw new StorageValidationError(`Invalid SQL identifier: ${value}`);
  }

  return `"${value}"`;
};

const jsonPath = (field: string): string => {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field)) {
    throw new StorageValidationError(`Unsupported JSON field name: ${field}`);
  }

  return `$."${field}"`;
};

const sqlField = (field: string): string => {
  if (field === "id") return "id";
  if (field === "createdAt") return "created_at";
  if (field === "updatedAt") return "updated_at";
  if (field === "revision") return "revision";

  return `json_extract(data, '${jsonPath(field)}')`;
};

const sqlValue = (value: unknown): unknown =>
  value instanceof Date ? value.toISOString() : value;

const buildComparison = (
  field: string,
  comparison: {
    readonly operator: string;
    readonly value: unknown;
  },
): { sql: string; values: unknown[] } => {
  const column = sqlField(field);
  const value = comparison.value;

  switch (comparison.operator) {
    case "eq":
      return value === null
        ? { sql: `${column} IS NULL`, values: [] }
        : { sql: `${column} = ?`, values: [sqlValue(value)] };

    case "ne":
      return value === null
        ? { sql: `${column} IS NOT NULL`, values: [] }
        : { sql: `${column} != ?`, values: [sqlValue(value)] };

    case "gt":
      return { sql: `${column} > ?`, values: [sqlValue(value)] };

    case "gte":
      return { sql: `${column} >= ?`, values: [sqlValue(value)] };

    case "lt":
      return { sql: `${column} < ?`, values: [sqlValue(value)] };

    case "lte":
      return { sql: `${column} <= ?`, values: [sqlValue(value)] };

    case "exists":
      return {
        sql: comparison.value ? `${column} IS NOT NULL` : `${column} IS NULL`,
        values: [],
      };

    case "in":
    case "notIn": {
      const values = value as readonly unknown[];

      if (values.length === 0) {
        return {
          sql: comparison.operator === "in" ? "0 = 1" : "1 = 1",
          values: [],
        };
      }

      const placeholders = values.map(() => "?").join(", ");
      const operator = comparison.operator === "in" ? "IN" : "NOT IN";

      return {
        sql: `${column} ${operator} (${placeholders})`,
        values: values.map(sqlValue),
      };
    }

    default:
      throw new StorageValidationError(
        `Unsupported query operator: ${comparison.operator}`,
      );
  }
};

const buildWhere = <T extends object>(
  where?: StorageWhere<T>,
): { sql: string; values: unknown[] } => {
  if (!where) return { sql: "1 = 1", values: [] };

  const parts: string[] = [];
  const values: unknown[] = [];

  for (const [field, comparison] of Object.entries(where)) {
    if (field === "and" || field === "or") {
      const nested = (comparison as readonly StorageWhere<T>[]).map((item) =>
        buildWhere(item),
      );

      if (nested.length === 0) continue;

      parts.push(
        `(${nested
          .map((item) => item.sql)
          .join(field === "and" ? " AND " : " OR ")})`,
      );

      for (const item of nested) values.push(...item.values);

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

    const result = buildComparison(field, {
      operator: value.operator,
      value: value.value,
    });

    parts.push(result.sql);
    values.push(...result.values);
  }

  return {
    sql: parts.length ? parts.join(" AND ") : "1 = 1",
    values,
  };
};

const buildOrderBy = <T extends StorageRecord>(
  orderBy?: StorageQuery<T>["orderBy"],
): string => {
  const items = (orderBy ?? []).map(
    (item) =>
      `${sqlField(String(item.field))} ${
        item.direction === "desc" ? "DESC" : "ASC"
      }`,
  );

  if (!items.some((item) => item.startsWith("id "))) {
    items.push("id ASC");
  }

  return items.join(", ");
};

const buildCursorWhere = <T extends StorageRecord>(
  orderBy: NonNullable<StorageQuery<T>["orderBy"]>,
  values: readonly unknown[],
): { sql: string; values: unknown[] } => {
  const fields = [
    ...orderBy.map((item) => ({
      field: String(item.field),
      direction: item.direction,
    })),
  ];

  if (!fields.some((item) => item.field === "id")) {
    fields.push({ field: "id", direction: "asc" });
  }

  const branches: string[] = [];
  const parameters: unknown[] = [];

  for (const [index, field] of fields.entries()) {
    const conditions: string[] = [];

    for (const [previous, prefix] of fields.slice(0, index).entries()) {
      conditions.push(`${sqlField(prefix.field)} = ?`);
      parameters.push(sqlValue(values[previous]));
    }

    const operator = field.direction === "desc" ? "<" : ">";

    conditions.push(`${sqlField(field.field)} ${operator} ?`);
    parameters.push(sqlValue(values[index]));

    branches.push(`(${conditions.join(" AND ")})`);
  }

  return {
    sql: `(${branches.join(" OR ")})`,
    values: parameters,
  };
};

const cleanChanges = <T extends StorageRecord>(
  changes: StorageUpdate<T>,
): Record<string, unknown> => {
  const result = { ...changes } as Record<string, unknown>;

  delete result.id;
  delete result.createdAt;
  delete result.updatedAt;
  delete result.revision;

  return result;
};

const toRecord = <T extends StorageRecord>(row: D1Row): T => {
  const data = deserialize<Record<string, unknown>>(row.data);

  return {
    ...data,
    id: row.id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    revision: row.revision,
  } as T;
};

const getChanges = (result: D1ResultLike): number =>
  Number(result.meta?.changes ?? 0);

const mapD1Error = (error: unknown): never => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (
    message.includes("unique constraint") ||
    message.includes("primary key")
  ) {
    throw new StorageDuplicateError("d1_unique_constraint");
  }

  throw error;
};

export class D1StorageAdapter implements StorageAdapter {
  readonly capabilities: StorageCapabilities = {
    transactions: true,
    atomicBatch: true,
    conditionalWrites: true,
    uniqueConstraints: true,
    upsert: true,
    cursorPagination: true,
    migrations: true,
    ttlIndexes: false,
  };

  private readonly database: D1DatabaseLike;
  private readonly prefix: string;

  constructor(options: D1StorageAdapterOptions) {
    this.database = options.database;
    this.prefix = options.tablePrefix ?? "puzzle_";
  }

  getCapabilities(): StorageCapabilityReport {
    return {
      capabilities: this.capabilities,
      limitations: [
        "D1 does not provide native TTL indexes. Expiration cleanup must be handled by an application or scheduled job.",
      ],
    };
  }

  private table(collection: StorageCollectionName): string {
    return quoteIdentifier(`${this.prefix}${collection}`);
  }

  private prepare(
    sql: string,
    values: readonly unknown[] = [],
  ): D1PreparedStatementLike {
    return this.database.prepare(sql).bind(...values);
  }

  private async run(
    sql: string,
    values: readonly unknown[] = [],
  ): Promise<D1ResultLike> {
    return this.prepare(sql, values).run();
  }

  private async first<T>(
    sql: string,
    values: readonly unknown[] = [],
  ): Promise<T | null> {
    return this.prepare(sql, values).first<T>();
  }

  private async all<T>(
    sql: string,
    values: readonly unknown[] = [],
  ): Promise<readonly T[]> {
    const result = await this.prepare(sql, values).all<T>();

    return result.results ?? [];
  }

  private insertStatement<T extends StorageRecord>(
    collection: StorageCollectionName,
    record: Parameters<StorageAdapter["insert"]>[1],
  ): {
    sql: string;
    values: readonly unknown[];
    record: T;
  } {
    const input = record as StorageRecord & {
      id: string;
      [key: string]: unknown;
    };

    const now = new Date();
    const createdAt = input.createdAt ?? now;
    const updatedAt = input.updatedAt ?? now;
    const revision = input.revision ?? 1;

    const {
      id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      revision: _revision,
      ...data
    } = input;

    const result = {
      id,
      createdAt,
      updatedAt,
      revision,
      ...data,
    } as T;

    return {
      sql: `INSERT INTO ${this.table(collection)}
        (id, created_at, updated_at, revision, data)
        VALUES (?, ?, ?, ?, ?)`,
      values: [
        id,
        createdAt.toISOString(),
        updatedAt.toISOString(),
        revision,
        serialize(data),
      ],
      record: result,
    };
  }

  async registerCollection<T extends StorageRecord>(
    definition: StorageCollection<T>,
  ): Promise<void> {
    const table = this.table(definition.name);

    await this.run(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id TEXT PRIMARY KEY NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        revision INTEGER NOT NULL CHECK (revision > 0),
        data TEXT NOT NULL CHECK (json_valid(data))
      )
    `);

    for (const index of definition.indexes ?? []) {
      const fields = index.fields.map((field) => {
        const fieldName = String(field);
        return sqlField(fieldName);
      });

      const unique = index.unique ? "UNIQUE " : "";
      const name = quoteIdentifier(
        `${this.prefix}${definition.name}_${index.name}`,
      );

      await this.run(`
        CREATE ${unique}INDEX IF NOT EXISTS ${name}
        ON ${table} (${fields.join(", ")})
      `);
    }
  }

  async findById<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
  ): Promise<T | null> {
    const row = await this.first<D1Row>(
      `SELECT * FROM ${this.table(collection)} WHERE id = ? LIMIT 1`,
      [id],
    );

    return row ? toRecord<T>(row) : null;
  }

  async findOne<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<T | null> {
    validateQuery(query);

    const where = buildWhere(query.where);

    const row = await this.first<D1Row>(
      `SELECT * FROM ${this.table(collection)}
       WHERE ${where.sql}
       ORDER BY ${buildOrderBy(query.orderBy)}
       LIMIT 1`,
      where.values,
    );

    return row ? toRecord<T>(row) : null;
  }

  async findMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T> = {},
  ): Promise<readonly T[]> {
    validateQuery(query);

    const where = buildWhere(query.where);

    const values = [...where.values];
    let pagination = "";

    if (query.limit !== undefined) {
      pagination += " LIMIT ?";
      values.push(query.limit);
    } else if (query.offset !== undefined) {
      pagination += " LIMIT -1";
    }

    if (query.offset !== undefined) {
      pagination += " OFFSET ?";
      values.push(query.offset);
    }

    const rows = await this.all<D1Row>(
      `SELECT * FROM ${this.table(collection)}
       WHERE ${where.sql}
       ORDER BY ${buildOrderBy(query.orderBy)}
       ${pagination}`,
      values,
    );

    return rows.map((row) => toRecord<T>(row));
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

    const base = buildWhere(query.where);
    let whereSql = base.sql;
    const values = [...base.values];

    if (query.after) {
      const cursor = decodeCursor(query.after);
      const after = buildCursorWhere(orderBy, cursor.values);

      whereSql = `(${whereSql}) AND ${after.sql}`;
      values.push(...after.values);
    }

    values.push(query.first + 1);

    const rows = await this.all<D1Row>(
      `SELECT * FROM ${this.table(collection)}
       WHERE ${whereSql}
       ORDER BY ${buildOrderBy(orderBy)}
       LIMIT ?`,
      values,
    );

    const hasNextPage = rows.length > query.first;
    const items = rows.slice(0, query.first);
    const last = items.at(-1);

    const cursorFields = [...orderBy.map((item) => String(item.field))];

    if (!cursorFields.includes("id")) cursorFields.push("id");

    const nextCursor =
      hasNextPage && last
        ? encodeCursor({
            values: cursorFields.map((field) => {
              if (field === "id") return last.id;
              if (field === "createdAt") return last.created_at;
              if (field === "updatedAt") return last.updated_at;
              if (field === "revision") return last.revision;

              return deserialize<Record<string, unknown>>(last.data)[field];
            }),
          })
        : null;

    return {
      items: items.map((row) => toRecord<T>(row)),
      hasNextPage,
      nextCursor,
    };
  }

  async insert<T extends StorageRecord>(
    collection: StorageCollectionName,
    record: Parameters<StorageAdapter["insert"]>[1],
  ): Promise<T> {
    const statement = this.insertStatement<T>(collection, record);

    try {
      await this.run(statement.sql, statement.values);
      return statement.record;
    } catch (error) {
      return mapD1Error(error);
    }
  }

  async upsert<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
    record: Parameters<StorageAdapter["insert"]>[1],
  ): Promise<T> {
    const existing = await this.findOne<T>(collection, query);

    if (existing) {
      const changes = {
        ...(record as Record<string, unknown>),
      } as StorageUpdate<T>;

      const updated = await this.update<T>(collection, existing.id, changes);

      if (!updated) throw new StorageConflictError();

      return updated;
    }

    return this.insert<T>(collection, record);
  }

  private buildUpdate(
    collection: StorageCollectionName,
    id: string,
    changes: Record<string, unknown>,
    condition?: StorageCondition,
  ): { sql: string; values: unknown[] } {
    const entries = Object.entries(changes);
    const expressions = entries.map(
      ([field]) => `data = json_set(data, ?, json(?))`,
    );

    const assignments: string[] = [];

    if (entries.length > 0) {
      assignments.push(
        `data = ${entries.reduce(
          (expression, _entry, index) => `json_set(${expression}, ?, json(?))`,
          "data",
        )}`,
      );
    }

    assignments.push("updated_at = ?");
    assignments.push("revision = revision + 1");

    const where = ["id = ?"];
    const values: unknown[] = [];

    for (const [field, value] of entries) {
      values.push(jsonPath(field), serialize(value));
    }

    values.push(new Date().toISOString(), id);

    if (condition?.expectedRevision !== undefined) {
      where.push("revision = ?");
      values.push(condition.expectedRevision);
    }

    if (condition?.expectedUpdatedAt !== undefined) {
      where.push("updated_at = ?");
      values.push(condition.expectedUpdatedAt.toISOString());
    }

    return {
      sql: `UPDATE ${this.table(collection)}
        SET ${assignments.join(", ")}
        WHERE ${where.join(" AND ")}`,
      values,
    };
  }

  async update<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
    changes: StorageUpdate<T>,
    condition?: StorageCondition,
  ): Promise<T | null> {
    const clean = cleanChanges(changes);
    const statement = this.buildUpdate(collection, id, clean, condition);

    const result = await this.run(statement.sql, statement.values);

    if (getChanges(result) === 0) {
      if (condition && (await this.findById(collection, id))) {
        throw new StorageConflictError();
      }

      return null;
    }

    return this.findById<T>(collection, id);
  }

  async updateMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
    changes: StorageUpdate<T>,
  ): Promise<number> {
    validateQuery(query);

    const clean = cleanChanges(changes);
    const entries = Object.entries(clean);
    const assignments = entries.length
      ? `data = ${entries.reduce(
          (expression) => `json_set(${expression}, ?, json(?))`,
          "data",
        )}, `
      : "";

    const values: unknown[] = [];

    for (const [field, value] of entries) {
      values.push(jsonPath(field), serialize(value));
    }

    values.push(new Date().toISOString());

    const where = buildWhere(query.where);
    values.push(...where.values);

    const result = await this.run(
      `UPDATE ${this.table(collection)}
       SET ${assignments}updated_at = ?, revision = revision + 1
       WHERE ${where.sql}`,
      values,
    );

    return getChanges(result);
  }

  async delete<T extends StorageRecord>(
    collection: StorageCollectionName,
    id: string,
    condition?: StorageCondition,
  ): Promise<boolean> {
    const where = ["id = ?"];
    const values: unknown[] = [id];

    if (condition?.expectedRevision !== undefined) {
      where.push("revision = ?");
      values.push(condition.expectedRevision);
    }

    if (condition?.expectedUpdatedAt !== undefined) {
      where.push("updated_at = ?");
      values.push(condition.expectedUpdatedAt.toISOString());
    }

    const result = await this.run(
      `DELETE FROM ${this.table(collection)}
       WHERE ${where.join(" AND ")}`,
      values,
    );

    if (getChanges(result) > 0) return true;

    if (condition && (await this.findById(collection, id))) {
      throw new StorageConflictError();
    }

    return false;
  }

  async deleteMany<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<number> {
    validateQuery(query);

    const where = buildWhere(query.where);
    const result = await this.run(
      `DELETE FROM ${this.table(collection)} WHERE ${where.sql}`,
      where.values,
    );

    return getChanges(result);
  }

  async exists<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T>,
  ): Promise<boolean> {
    validateQuery(query);

    const where = buildWhere(query.where);
    const result = await this.first<{ found: number }>(
      `SELECT 1 AS found FROM ${this.table(collection)}
       WHERE ${where.sql} LIMIT 1`,
      where.values,
    );

    return result !== null;
  }

  async count<T extends StorageRecord>(
    collection: StorageCollectionName,
    query: StorageQuery<T> = {},
  ): Promise<number> {
    validateQuery(query);

    const where = buildWhere(query.where);
    const result = await this.first<{ total: number }>(
      `SELECT COUNT(*) AS total FROM ${this.table(collection)}
       WHERE ${where.sql}`,
      where.values,
    );

    return Number(result?.total ?? 0);
  }

  async atomicBatch<T extends StorageRecord>(
    operations: readonly StorageBatchOperation<T>[],
  ): Promise<StorageBatchResult<T>> {
    const assertionTable = quoteIdentifier(`${this.prefix}atomic_assertions`);

    await this.run(`
      CREATE TABLE IF NOT EXISTS ${assertionTable} (
        value INTEGER NOT NULL CHECK (value = 1)
      )
    `);

    const statements: D1PreparedStatementLike[] = [];
    const resultIndexes: number[] = [];

    for (const operation of operations) {
      const table = this.table(operation.collection);

      if (
        operation.type !== "insert" &&
        (operation.condition?.expectedRevision !== undefined ||
          operation.condition?.expectedUpdatedAt !== undefined)
      ) {
        const conditions = ["id = ?"];
        const values: unknown[] = [operation.id];

        if (operation.condition.expectedRevision !== undefined) {
          conditions.push("revision = ?");
          values.push(operation.condition.expectedRevision);
        }

        if (operation.condition.expectedUpdatedAt !== undefined) {
          conditions.push("updated_at = ?");
          values.push(operation.condition.expectedUpdatedAt.toISOString());
        }

        statements.push(
          this.prepare(
            `INSERT INTO ${assertionTable}(value)
             SELECT CASE WHEN EXISTS (
               SELECT 1 FROM ${table}
               WHERE ${conditions.join(" AND ")}
             ) THEN 1 ELSE 0 END`,
            values,
          ),
        );

        statements.push(this.prepare(`DELETE FROM ${assertionTable}`));
      }

      if (operation.type === "insert") {
        const statement = this.insertStatement<T>(
          operation.collection,
          operation.record,
        );

        statements.push(this.prepare(statement.sql, statement.values));

        resultIndexes.push(statements.length - 1);
        continue;
      }

      if (operation.type === "update") {
        const statement = this.buildUpdate(
          operation.collection,
          operation.id,
          cleanChanges(operation.changes),
          operation.condition,
        );

        statements.push(this.prepare(statement.sql, statement.values));

        resultIndexes.push(statements.length - 1);
        continue;
      }

      const conditions = ["id = ?"];
      const values: unknown[] = [operation.id];

      if (operation.condition?.expectedRevision !== undefined) {
        conditions.push("revision = ?");
        values.push(operation.condition.expectedRevision);
      }

      if (operation.condition?.expectedUpdatedAt !== undefined) {
        conditions.push("updated_at = ?");
        values.push(operation.condition.expectedUpdatedAt.toISOString());
      }

      statements.push(
        this.prepare(
          `DELETE FROM ${table} WHERE ${conditions.join(" AND ")}`,
          values,
        ),
      );

      resultIndexes.push(statements.length - 1);
    }

    try {
      const batchResults = await this.database.batch(statements);
      const results: StorageBatchResult<T>["results"][number][] = [];

      for (const [index, operation] of operations.entries()) {
        const resultIndex = resultIndexes[index];
        const result =
          resultIndex === undefined ? undefined : batchResults[resultIndex];

        if (!result) {
          throw new StorageAtomicityError(
            "D1 batch did not return a result for every operation.",
          );
        }

        if (operation.type === "insert") {
          const input = operation.record as StorageRecord & {
            id: string;
          };

          const inserted = await this.findById<T>(
            operation.collection,
            input.id,
          );

          if (!inserted) {
            throw new StorageAtomicityError(
              "D1 batch committed but the inserted record could not be read.",
            );
          }

          results.push({ type: "insert", record: inserted });
          continue;
        }

        if (operation.type === "update") {
          results.push({
            type: "update",
            record: await this.findById<T>(operation.collection, operation.id),
          });
          continue;
        }

        results.push({
          type: "delete",
          deleted: getChanges(result) > 0,
        });
      }

      return { results };
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : "";

      if (message.includes("check constraint")) {
        throw new StorageConflictError();
      }

      return mapD1Error(error);
    }
  }
}
