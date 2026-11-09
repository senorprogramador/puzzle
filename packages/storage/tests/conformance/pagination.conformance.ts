import { describe, expect, it } from "bun:test";
import type { StorageAdapter, StorageInsert } from "../../src";
import {
  createUser,
  USERS_COLLECTION,
  type ConformanceUser,
} from "./storage-adapter.test-types";

export const runPaginationConformance = (
  createAdapter: () => Promise<StorageAdapter>,
  reset: () => Promise<void>,
) => {
  describe("cursor pagination conformance", () => {
    it("returns the first page and a continuation cursor", async () => {
      await reset();

      const adapter = await createAdapter();

      for (let i = 1; i <= 5; i++) {
        await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
          id: `user-${i}`,
          ...createUser({ age: i * 10 }),
        } as StorageInsert<ConformanceUser>);
      }

      const page = await adapter.findPage<ConformanceUser>(USERS_COLLECTION, {
        first: 2,
        orderBy: [{ field: "id", direction: "asc" }],
      });

      expect(page.items).toHaveLength(2);
      expect(page.hasNextPage).toBe(true);
      expect(page.nextCursor).not.toBeNull();
    });

    it("does not duplicate records across pages", async () => {
      await reset();

      const adapter = await createAdapter();

      for (let i = 1; i <= 5; i++) {
        await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
          id: `user-${i}`,
          ...createUser({ age: i * 10 }),
        } as StorageInsert<ConformanceUser>);
      }

      const first = await adapter.findPage<ConformanceUser>(USERS_COLLECTION, {
        first: 2,
        orderBy: [{ field: "id", direction: "asc" }],
      });

      expect(first.nextCursor).not.toBeNull();

      const second = await adapter.findPage<ConformanceUser>(USERS_COLLECTION, {
        first: 2,
        after: first.nextCursor!,
        orderBy: [{ field: "id", direction: "asc" }],
      });

      const ids = [
        ...first.items.map(({ id }) => id),
        ...second.items.map(({ id }) => id),
      ];

      expect(new Set(ids).size).toBe(ids.length);
      expect(second.items).toHaveLength(2);
    });

    it("returns hasNextPage false on the final page", async () => {
      await reset();

      const adapter = await createAdapter();

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "user-1",
        ...createUser(),
      } as StorageInsert<ConformanceUser>);

      const page = await adapter.findPage<ConformanceUser>(USERS_COLLECTION, {
        first: 10,
      });

      expect(page.items).toHaveLength(1);
      expect(page.hasNextPage).toBe(false);
      expect(page.nextCursor).toBeNull();
    });
  });
};
