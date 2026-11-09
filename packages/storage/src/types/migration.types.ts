export type StorageMigrationContext = {
  readonly execute: (operation: StorageMigrationOperation) => Promise<void>;
};

export type StorageMigrationOperation =
  | {
      readonly type: "createCollection";
      readonly collection: string;
    }
  | {
      readonly type: "dropCollection";
      readonly collection: string;
    }
  | {
      readonly type: "createIndex";
      readonly collection: string;
      readonly name: string;
      readonly fields: readonly string[];
      readonly unique?: boolean;
      readonly expireAfterSeconds?: number;
    }
  | {
      readonly type: "dropIndex";
      readonly collection: string;
      readonly name: string;
    };

export type StorageMigration = {
  readonly id: string;
  readonly version: number;
  readonly description: string;
  readonly up: (context: StorageMigrationContext) => Promise<void>;
};

export type StorageMigrationStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export type StorageMigrationRecord = {
  readonly id: string;
  readonly version: number;
  readonly description: string;
  readonly status: StorageMigrationStatus;
  readonly startedAt?: Date;
  readonly completedAt?: Date;
  readonly error?: string;
};

export type StorageMigrationResult = {
  readonly applied: readonly number[];
  readonly skipped: readonly number[];
  readonly currentVersion: number;
};

export type StorageMigrationOptions = {
  readonly targetVersion?: number;
  readonly dryRun?: boolean;
};

export interface StorageMigrationAdapter {
  getMigrationStatus(): Promise<{
    readonly currentVersion: number;
    readonly migrations: readonly StorageMigrationRecord[];
  }>;

  runMigrations(
    migrations: readonly StorageMigration[],
    options?: StorageMigrationOptions,
  ): Promise<StorageMigrationResult>;
}
