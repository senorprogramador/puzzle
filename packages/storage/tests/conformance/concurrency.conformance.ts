import { describe, expect, it } from "bun:test";
import {
  StorageConflictError,
  type StorageAdapter,
  type StorageInsert,
} from "../../src";
import {
  createUser,
  USERS_COLLECTION,
  type ConformanceUser,
} from "./storage-adapter.test-types";

export const runConcurrencyConformance = (
  createAdapter: () => Promise<StorageAdapter>,
  reset: () => Promise<void>,
) => {
  describe("optimistic concurrency conformance", () => {
    it("increments revision on successful update", async () => {
      await reset();

      const adapter = await createAdapter();

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "revision-test",
        ...createUser(),
      } as StorageInsert<ConformanceUser>);

      const updated = await adapter.update<ConformanceUser>(
        USERS_COLLECTION,
        "revision-test",
        { name: "Updated" },
        { expectedRevision: 1 },
      );

      expect(updated?.revision).toBe(2);
    });

    it("rejects update when expected revision is stale", async () => {
      await reset();

      const adapter = await createAdapter();

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "stale-test",
        ...createUser(),
      } as StorageInsert<ConformanceUser>);

      await adapter.update<ConformanceUser>(
        USERS_COLLECTION,
        "stale-test",
        { name: "First update" },
        { expectedRevision: 1 },
      );

      await expect(
        adapter.update<ConformanceUser>(
          USERS_COLLECTION,
          "stale-test",
          { name: "Stale update" },
          { expectedRevision: 1 },
        ),
      ).rejects.toBeInstanceOf(StorageConflictError);
    });

    it("does not lose concurrent conditional updates", async () => {
      await reset();

      const adapter = await createAdapter();

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "concurrent-test",
        ...createUser(),
      } as StorageInsert<ConformanceUser>);

      const results = await Promise.allSettled([
        adapter.update<ConformanceUser>(
          USERS_COLLECTION,
          "concurrent-test",
          { name: "Update A" },
          { expectedRevision: 1 },
        ),
        adapter.update<ConformanceUser>(
          USERS_COLLECTION,
          "concurrent-test",
          { name: "Update B" },
          { expectedRevision: 1 },
        ),
      ]);

      const successful = results.filter(
        (result) => result.status === "fulfilled",
      );
      const rejected = results.filter((result) => result.status === "rejected");

      expect(successful).toHaveLength(1);
      expect(rejected).toHaveLength(1);
    });
  });
};
