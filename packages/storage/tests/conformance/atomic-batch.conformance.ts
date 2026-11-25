import { describe, expect, it } from "bun:test";
import {
  StorageAtomicityError,
  StorageConflictError,
  type StorageAdapter,
  type StorageBatchOperation,
  type StorageInsert,
} from "../../src";
import {
  createUser,
  USERS_COLLECTION,
  type ConformanceUser,
} from "./storage-adapter.test-types";

export const runAtomicBatchConformance = (
  createAdapter: () => Promise<StorageAdapter>,
  reset: () => Promise<void>,
): void => {
  describe("atomicBatch conformance", () => {
    it("rejects atomicBatch when atomic rollback is unsupported", async () => {
      await reset();

      const adapter = await createAdapter();

      if (adapter.capabilities.atomicBatch) return;

      await expect(
        adapter.atomicBatch<ConformanceUser>([]),
      ).rejects.toBeInstanceOf(StorageAtomicityError);
    });

    it("commits every operation when the batch succeeds", async () => {
      await reset();

      const adapter = await createAdapter();

      if (!adapter.capabilities.atomicBatch) return;

      const operations: StorageBatchOperation<ConformanceUser>[] = [
        {
          type: "insert",
          collection: USERS_COLLECTION,
          record: {
            id: "batch-1",
            ...createUser({
              name: "Batch One",
              email: "batch-1@example.com",
              normalizedEmail: "batch-1@example.com",
            }),
          } as StorageInsert<ConformanceUser>,
        },
        {
          type: "insert",
          collection: USERS_COLLECTION,
          record: createUser({
            name: "Batch Two",
            email: "batch-2@example.com",
            normalizedEmail: "batch-2@example.com",
          }),
        },
        {
          type: "insert",
          collection: USERS_COLLECTION,
          record: createUser({
            name: "Batch Three",
            email: "batch-3@example.com",
            normalizedEmail: "batch-3@example.com",
          }),
        },
      ];

      const result = await adapter.atomicBatch(operations);

      expect(result.results).toHaveLength(3);
      const inserted = result.results
        .filter((item) => item.type === "insert")
        .map((item) => item.record);
      expect(inserted.map(({ id }) => id)).toEqual([
        "batch-1",
        expect.any(String),
        expect.any(String),
      ]);
      const generatedRecords = inserted.slice(1);
      expect(generatedRecords).toHaveLength(2);
      const firstGenerated = generatedRecords[0];
      const secondGenerated = generatedRecords[1];
      if (!firstGenerated || !secondGenerated) {
        throw new Error("Expected two generated batch records.");
      }

      expect(firstGenerated.id).not.toBe(secondGenerated.id);
      expect(
        await adapter.findById<ConformanceUser>(
          USERS_COLLECTION,
          firstGenerated.id,
        ),
      ).toEqual(firstGenerated);
      expect(
        await adapter.findById<ConformanceUser>(
          USERS_COLLECTION,
          secondGenerated.id,
        ),
      ).toEqual(secondGenerated);
      expect(await adapter.count<ConformanceUser>(USERS_COLLECTION)).toBe(3);
    });

    it("rolls back all operations when any operation fails", async () => {
      await reset();

      const adapter = await createAdapter();

      if (!adapter.capabilities.atomicBatch) return;

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "existing",
        ...createUser(),
      } as StorageInsert<ConformanceUser>);

      const operations: StorageBatchOperation<ConformanceUser>[] = [
        {
          type: "insert",
          collection: USERS_COLLECTION,
          record: {
            id: "should-rollback",
            ...createUser({ email: "rollback@example.com" }),
          } as StorageInsert<ConformanceUser>,
        },
        {
          type: "insert",
          collection: USERS_COLLECTION,
          record: {
            id: "existing",
            ...createUser({ email: "duplicate@example.com" }),
          } as StorageInsert<ConformanceUser>,
        },
      ];

      await expect(adapter.atomicBatch(operations)).rejects.toBeDefined();

      expect(
        await adapter.findById<ConformanceUser>(
          USERS_COLLECTION,
          "should-rollback",
        ),
      ).toBeNull();

      expect(
        await adapter.findById<ConformanceUser>(USERS_COLLECTION, "existing"),
      ).not.toBeNull();

      expect(await adapter.count<ConformanceUser>(USERS_COLLECTION)).toBe(1);
    });

    it("rolls back earlier updates when a later operation conflicts", async () => {
      await reset();

      const adapter = await createAdapter();

      if (!adapter.capabilities.atomicBatch) return;

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "update-target",
        ...createUser({ name: "Before" }),
      } as StorageInsert<ConformanceUser>);

      const operations: StorageBatchOperation<ConformanceUser>[] = [
        {
          type: "update",
          collection: USERS_COLLECTION,
          id: "update-target",
          condition: { expectedRevision: 1 },
          changes: { name: "Should Roll Back" },
        },
        {
          type: "update",
          collection: USERS_COLLECTION,
          id: "missing",
          condition: { expectedRevision: 99 },
          changes: { name: "Conflict" },
        },
      ];

      await expect(adapter.atomicBatch(operations)).rejects.toBeInstanceOf(
        StorageConflictError,
      );

      const record = await adapter.findById<ConformanceUser>(
        USERS_COLLECTION,
        "update-target",
      );

      expect(record?.name).toBe("Before");
      expect(record?.revision).toBe(1);
    });
  });
};
