import type { StorageAdapter, StorageMigrationAdapter } from "../../src";

export type ConformanceFixture = {
  /**
   * Create a new adapter instance connected to a clean test database.
   *
   * Every test should receive isolated data.
   */
  createAdapter: () => Promise<StorageAdapter>;

  /**
   * Reset database state between tests.
   *
   * This may truncate collections or recreate a temporary database.
   */
  reset: () => Promise<void>;

  /**
   * Dispose of connections and temporary resources.
   */
  dispose?: () => Promise<void>;
};

export type MigrationConformanceFixture = {
  createMigrationAdapter: () => Promise<StorageMigrationAdapter>;
  reset: () => Promise<void>;
  dispose?: () => Promise<void>;
};
