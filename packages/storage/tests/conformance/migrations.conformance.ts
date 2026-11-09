import { describe, expect, it } from "bun:test";
import type { StorageMigration, StorageMigrationAdapter } from "../../src";

export const runMigrationConformance = (
  createMigrationAdapter: () => Promise<StorageMigrationAdapter>,
  reset: () => Promise<void>,
) => {
  describe("migration conformance", () => {
    it("starts at version zero for an empty database", async () => {
      await reset();

      const adapter = await createMigrationAdapter();
      const status = await adapter.getMigrationStatus();

      expect(status.currentVersion).toBe(0);
      expect(status.migrations).toEqual([]);
    });

    it("applies migrations in version order", async () => {
      await reset();

      const adapter = await createMigrationAdapter();
      const executed: number[] = [];

      const migrations: StorageMigration[] = [
        {
          id: "migration-2",
          version: 2,
          description: "Second migration",
          up: async () => {
            executed.push(2);
          },
        },
        {
          id: "migration-1",
          version: 1,
          description: "First migration",
          up: async () => {
            executed.push(1);
          },
        },
      ];

      const result = await adapter.runMigrations(migrations);

      expect(executed).toEqual([1, 2]);
      expect(result.currentVersion).toBe(2);
      expect(result.applied).toEqual([1, 2]);
    });

    it("does not reapply completed migrations", async () => {
      await reset();

      const adapter = await createMigrationAdapter();
      let executionCount = 0;

      const migrations: StorageMigration[] = [
        {
          id: "once-only",
          version: 1,
          description: "Run only once",
          up: async () => {
            executionCount++;
          },
        },
      ];

      await adapter.runMigrations(migrations);
      await adapter.runMigrations(migrations);

      expect(executionCount).toBe(1);
    });

    it("records migration failures", async () => {
      await reset();

      const adapter = await createMigrationAdapter();

      const migrations: StorageMigration[] = [
        {
          id: "failure",
          version: 1,
          description: "Intentional failure",
          up: async () => {
            throw new Error("Migration failed");
          },
        },
      ];

      await expect(adapter.runMigrations(migrations)).rejects.toThrow(
        "Migration failed",
      );

      const status = await adapter.getMigrationStatus();

      expect(status.migrations).toHaveLength(1);
      expect(status.migrations[0]?.status).toBe("failed");
    });

    it("supports targetVersion", async () => {
      await reset();

      const adapter = await createMigrationAdapter();
      const executed: number[] = [];

      const migrations: StorageMigration[] = [1, 2, 3].map((version) => ({
        id: `migration-${version}`,
        version,
        description: `Migration ${version}`,
        up: async () => {
          executed.push(version);
        },
      }));

      const result = await adapter.runMigrations(migrations, {
        targetVersion: 2,
      });

      expect(executed).toEqual([1, 2]);
      expect(result.currentVersion).toBe(2);
    });

    it("prevents concurrent runners from applying the same migration twice", async () => {
      await reset();

      const adapterA = await createMigrationAdapter();
      const adapterB = await createMigrationAdapter();

      let executionCount = 0;

      const migrations: StorageMigration[] = [
        {
          id: "concurrent-migration",
          version: 1,
          description: "Concurrent migration",
          up: async () => {
            executionCount++;

            // Simulate a migration that takes time.
            await new Promise((resolve) => setTimeout(resolve, 20));
          },
        },
      ];

      await Promise.all([
        adapterA.runMigrations(migrations),
        adapterB.runMigrations(migrations),
      ]);

      expect(executionCount).toBe(1);
    });
  });
};
