import { randomUUID } from "node:crypto";
import type { Db, Document } from "mongodb";

import {
  type StorageMigration,
  type StorageMigrationAdapter,
  type StorageMigrationOperation,
  type StorageMigrationOptions,
  type StorageMigrationRecord,
  type StorageMigrationResult,
} from "@puzzle-ui/storage";

import type { MongoStorageMigrationOptions } from "./mongodb.types";

type MigrationDocument = Document & {
  _id: string;
  version: number;
  description: string;
  status: "running" | "completed" | "failed";
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
};

type MigrationLockDocument = Document & {
  _id: string;
  owner: string;
  expiresAt: Date;
};

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const isDuplicate = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: number }).code === 11000;

export class MongoStorageMigrationAdapter implements StorageMigrationAdapter {
  private readonly database: Db;
  private readonly prefix: string;
  private readonly lockDurationMs: number;

  constructor(options: MongoStorageMigrationOptions) {
    this.database = options.database;
    this.prefix = options.collectionPrefix ?? "puzzle_";
    this.lockDurationMs = options.lockDurationMs ?? 600_000;
  }

  private get migrations() {
    return this.database.collection<MigrationDocument>(
      `${this.prefix}migrations`,
    );
  }

  private get locks() {
    return this.database.collection<MigrationLockDocument>(
      `${this.prefix}migration_locks`,
    );
  }

  private async ensureCollections() {
    for (const name of [
      `${this.prefix}migrations`,
      `${this.prefix}migration_locks`,
    ]) {
      try {
        await this.database.createCollection(name);
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
    }

    await this.locks.createIndexes([
      {
        key: { expiresAt: 1 },
        name: "expiresAt_ttl",
        expireAfterSeconds: 0,
      },
    ]);
  }

  async getMigrationStatus(): Promise<{
    currentVersion: number;
    migrations: readonly StorageMigrationRecord[];
  }> {
    await this.ensureCollections();

    const records = await this.migrations
      .find({ _id: { $ne: "__lock__" } })
      .sort({ version: 1 })
      .toArray();

    const migrations = records.map((record) => ({
      id: record._id,
      version: record.version,
      description: record.description,
      status: record.status,
      ...(record.startedAt ? { startedAt: record.startedAt } : {}),
      ...(record.completedAt ? { completedAt: record.completedAt } : {}),
      ...(record.error ? { error: record.error } : {}),
    })) satisfies StorageMigrationRecord[];

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
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.lockDurationMs);

      try {
        await this.locks.updateOne(
          {
            _id: "global",
            $or: [{ expiresAt: { $lt: now } }, { owner }],
          },
          {
            $set: { owner, expiresAt },
          },
          { upsert: true },
        );

        const lock = await this.locks.findOne({ _id: "global" });

        if (lock?.owner === owner) return;
      } catch (error) {
        if (!isDuplicate(error)) throw error;
      }

      await sleep(50);
    }

    throw new Error("Timed out while acquiring the migration lock.");
  }

  private async execute(operation: StorageMigrationOperation): Promise<void> {
    switch (operation.type) {
      case "createCollection": {
        try {
          await this.database.createCollection(
            `${this.prefix}${operation.collection}`,
          );
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

        return;
      }

      case "dropCollection":
        await this.database
          .dropCollection(`${this.prefix}${operation.collection}`)
          .catch(() => false);
        return;

      case "createIndex": {
        const collection = this.database.collection(
          `${this.prefix}${operation.collection}`,
        );

        await collection.createIndexes([
          {
            key: Object.fromEntries(
              operation.fields.map((field) => [field, 1]),
            ),
            name: operation.name,
            unique: operation.unique ?? false,
            ...(operation.expireAfterSeconds !== undefined
              ? { expireAfterSeconds: operation.expireAfterSeconds }
              : {}),
          },
        ]);

        return;
      }

      case "dropIndex":
        await this.database
          .collection(`${this.prefix}${operation.collection}`)
          .dropIndex(operation.name);
        return;
    }
  }

  async runMigrations(
    migrations: readonly StorageMigration[],
    options: StorageMigrationOptions = {},
  ): Promise<StorageMigrationResult> {
    await this.ensureCollections();

    const owner = randomUUID();
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

        const existing = await this.migrations.findOne({
          _id: migration.id,
        });

        if (existing?.status === "completed") {
          skipped.push(migration.version);
          continue;
        }

        if (options.dryRun) {
          applied.push(migration.version);
          continue;
        }

        const startedAt = new Date();

        await this.migrations.updateOne(
          { _id: migration.id },
          {
            $set: {
              version: migration.version,
              description: migration.description,
              status: "running",
              startedAt,
            },
            $unset: {
              completedAt: "",
              error: "",
            },
          },
          { upsert: true },
        );

        try {
          await migration.up({
            execute: (operation) => this.execute(operation),
          });

          await this.migrations.updateOne(
            { _id: migration.id },
            {
              $set: {
                status: "completed",
                completedAt: new Date(),
              },
            },
          );

          applied.push(migration.version);
        } catch (error) {
          await this.migrations.updateOne(
            { _id: migration.id },
            {
              $set: {
                status: "failed",
                error: error instanceof Error ? error.message : String(error),
              },
            },
          );

          throw error;
        }
      }
    } finally {
      await this.locks.deleteOne({
        _id: "global",
        owner,
      });
    }

    const status = await this.getMigrationStatus();

    return {
      applied,
      skipped,
      currentVersion: status.currentVersion,
    };
  }
}
