import {
  type StorageMigration,
  type StorageMigrationAdapter,
  type StorageMigrationOperation,
  type StorageMigrationOptions,
  type StorageMigrationRecord,
  type StorageMigrationResult,
} from "@puzzle-ui/storage";

import type { D1DatabaseLike, D1StorageMigrationOptions } from "./d1.types";

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const quote = (value: string) => {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
    throw new Error(`Invalid SQL identifier: ${value}`);
  }

  return `"${value}"`;
};

export class D1StorageMigrationAdapter implements StorageMigrationAdapter {
  private readonly database: D1DatabaseLike;
  private readonly prefix: string;
  private readonly lockDurationMs: number;

  constructor(options: D1StorageMigrationOptions) {
    this.database = options.database;
    this.prefix = options.tablePrefix ?? "puzzle_";
    this.lockDurationMs = options.lockDurationMs ?? 600_000;
  }

  private get migrationsTable() {
    return quote(`${this.prefix}migrations`);
  }

  private get lockTable() {
    return quote(`${this.prefix}migration_lock`);
  }

  private async run(sql: string, values: readonly unknown[] = []) {
    return this.database
      .prepare(sql)
      .bind(...values)
      .run();
  }

  private async ensureTables() {
    await this.run(`
      CREATE TABLE IF NOT EXISTS ${this.migrationsTable} (
        id TEXT PRIMARY KEY NOT NULL,
        version INTEGER NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        started_at TEXT,
        completed_at TEXT,
        error TEXT
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS ${this.lockTable} (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        owner TEXT NOT NULL,
        expires_at INTEGER NOT NULL
      )
    `);

    await this.run(`
      INSERT OR IGNORE INTO ${this.lockTable}
      (id, owner, expires_at)
      VALUES (1, '', 0)
    `);
  }

  async getMigrationStatus(): Promise<{
    currentVersion: number;
    migrations: readonly StorageMigrationRecord[];
  }> {
    await this.ensureTables();

    const result = await this.database
      .prepare(
        `SELECT id, version, description, status,
          started_at, completed_at, error
         FROM ${this.migrationsTable}
         ORDER BY version ASC`,
      )
      .all<Record<string, unknown>>();

    const migrations = (result.results ?? []).map((row) => ({
      id: String(row.id),
      version: Number(row.version),
      description: String(row.description),
      status: String(row.status) as StorageMigrationRecord["status"],
      ...(row.started_at
        ? { startedAt: new Date(String(row.started_at)) }
        : {}),
      ...(row.completed_at
        ? { completedAt: new Date(String(row.completed_at)) }
        : {}),
      ...(row.error ? { error: String(row.error) } : {}),
    }));

    return {
      currentVersion: migrations.reduce(
        (version, migration) =>
          migration.status === "completed"
            ? Math.max(version, migration.version)
            : version,
        0,
      ),
      migrations,
    };
  }

  private async acquireLock(owner: string): Promise<void> {
    const deadline = Date.now() + this.lockDurationMs;

    while (Date.now() < deadline) {
      const now = Date.now();
      const expiresAt = now + this.lockDurationMs;

      const result = await this.run(
        `UPDATE ${this.lockTable}
         SET owner = ?, expires_at = ?
         WHERE id = 1 AND expires_at < ?`,
        [owner, expiresAt, now],
      );

      if (Number(result.meta?.changes ?? 0) === 1) return;

      await sleep(50);
    }

    throw new Error("Timed out while acquiring the D1 migration lock.");
  }

  private async execute(operation: StorageMigrationOperation): Promise<void> {
    switch (operation.type) {
      case "createCollection": {
        const table = quote(`${this.prefix}${operation.collection}`);

        await this.run(`
          CREATE TABLE IF NOT EXISTS ${table} (
            id TEXT PRIMARY KEY NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            revision INTEGER NOT NULL CHECK (revision > 0),
            data TEXT NOT NULL CHECK (json_valid(data))
          )
        `);

        return;
      }

      case "dropCollection":
        await this.run(
          `DROP TABLE IF EXISTS ${quote(
            `${this.prefix}${operation.collection}`,
          )}`,
        );
        return;

      case "createIndex": {
        const table = quote(`${this.prefix}${operation.collection}`);
        const name = quote(`${this.prefix}${operation.name}`);

        const fields = operation.fields.map((field) => {
          if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field)) {
            throw new Error(`Invalid index field: ${field}`);
          }

          if (
            field === "id" ||
            field === "createdAt" ||
            field === "updatedAt" ||
            field === "revision"
          ) {
            const columns: Record<string, string> = {
              id: "id",
              createdAt: "created_at",
              updatedAt: "updated_at",
              revision: "revision",
            };

            return columns[field];
          }

          return `json_extract(data, '$."${field}"')`;
        });

        await this.run(`
          CREATE ${operation.unique ? "UNIQUE " : ""}INDEX IF NOT EXISTS ${name}
          ON ${table} (${fields.join(", ")})
        `);

        return;
      }

      case "dropIndex":
        await this.run(
          `DROP INDEX IF EXISTS ${quote(`${this.prefix}${operation.name}`)}`,
        );
        return;
    }
  }

  async runMigrations(
    migrations: readonly StorageMigration[],
    options: StorageMigrationOptions = {},
  ): Promise<StorageMigrationResult> {
    await this.ensureTables();

    const owner = crypto.randomUUID();
    await this.acquireLock(owner);

    const applied: number[] = [];
    const skipped: number[] = [];

    try {
      const sorted = [...migrations].sort((a, b) => a.version - b.version);

      for (const migration of sorted) {
        if (
          options.targetVersion !== undefined &&
          migration.version > options.targetVersion
        ) {
          skipped.push(migration.version);
          continue;
        }

        const existing = await this.database
          .prepare(
            `SELECT status FROM ${this.migrationsTable}
             WHERE id = ? LIMIT 1`,
          )
          .bind(migration.id)
          .first<{ status: string }>();

        if (existing?.status === "completed") {
          skipped.push(migration.version);
          continue;
        }

        if (options.dryRun) {
          applied.push(migration.version);
          continue;
        }

        const startedAt = new Date().toISOString();

        await this.run(
          `INSERT INTO ${this.migrationsTable}
            (id, version, description, status, started_at)
           VALUES (?, ?, ?, 'running', ?)
           ON CONFLICT(id) DO UPDATE SET
             version = excluded.version,
             description = excluded.description,
             status = 'running',
             started_at = excluded.started_at,
             completed_at = NULL,
             error = NULL`,
          [migration.id, migration.version, migration.description, startedAt],
        );

        try {
          await migration.up({
            execute: (operation) => this.execute(operation),
          });

          await this.run(
            `UPDATE ${this.migrationsTable}
             SET status = 'completed', completed_at = ?, error = NULL
             WHERE id = ?`,
            [new Date().toISOString(), migration.id],
          );

          applied.push(migration.version);
        } catch (error) {
          await this.run(
            `UPDATE ${this.migrationsTable}
             SET status = 'failed', error = ?
             WHERE id = ?`,
            [
              error instanceof Error ? error.message : String(error),
              migration.id,
            ],
          );

          throw error;
        }
      }
    } finally {
      await this.run(
        `UPDATE ${this.lockTable}
         SET owner = '', expires_at = 0
         WHERE id = 1 AND owner = ?`,
        [owner],
      );
    }

    const status = await this.getMigrationStatus();

    return {
      applied,
      skipped,
      currentVersion: status.currentVersion,
    };
  }
}
