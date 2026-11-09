import { describe, expect, it } from "bun:test";
import type { StorageAdapter, StorageInsert } from "../../src";
import {
  createUser,
  USERS_COLLECTION,
  type ConformanceUser,
} from "./storage-adapter.test-types";

export const runSerializationConformance = (
  createAdapter: () => Promise<StorageAdapter>,
  reset: () => Promise<void>,
) => {
  describe("serialization conformance", () => {
    it("round-trips Date fields as Date objects", async () => {
      await reset();

      const adapter = await createAdapter();
      const createdAt = new Date("2025-01-02T03:04:05.000Z");
      const updatedAt = new Date("2025-02-03T04:05:06.000Z");

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "date-test",
        ...createUser(),
        createdAt,
        updatedAt,
      } as StorageInsert<ConformanceUser>);

      const record = await adapter.findById<ConformanceUser>(
        USERS_COLLECTION,
        "date-test",
      );

      expect(record?.createdAt).toBeInstanceOf(Date);
      expect(record?.updatedAt).toBeInstanceOf(Date);
      expect(record?.createdAt.toISOString()).toBe(createdAt.toISOString());
      expect(record?.updatedAt.toISOString()).toBe(updatedAt.toISOString());
    });

    it("preserves explicit null values", async () => {
      await reset();

      const adapter = await createAdapter();

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "null-test",
        ...createUser({ nullableValue: null }),
      } as StorageInsert<ConformanceUser>);

      const record = await adapter.findById<ConformanceUser>(
        USERS_COLLECTION,
        "null-test",
      );

      expect(record).not.toBeNull();
      expect(record?.nullableValue).toBeNull();
    });

    it("preserves arrays and booleans", async () => {
      await reset();

      const adapter = await createAdapter();

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "array-test",
        ...createUser({
          active: false,
          tags: ["alpha", "beta"],
        }),
      } as StorageInsert<ConformanceUser>);

      const record = await adapter.findById<ConformanceUser>(
        USERS_COLLECTION,
        "array-test",
      );

      expect(record?.active).toBe(false);
      expect(record?.tags).toEqual(["alpha", "beta"]);
    });
  });
};
