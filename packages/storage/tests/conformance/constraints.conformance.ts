import { describe, expect, it } from "bun:test";
import {
  StorageDuplicateError,
  type StorageAdapter,
  type StorageInsert,
} from "../../src";
import {
  createUser,
  USERS_COLLECTION,
  type ConformanceUser,
} from "./storage-adapter.test-types";

export const runConstraintConformance = (
  createAdapter: () => Promise<StorageAdapter>,
  reset: () => Promise<void>,
) => {
  describe("unique constraint conformance", () => {
    it("rejects duplicate primary keys", async () => {
      await reset();

      const adapter = await createAdapter();

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "duplicate-id",
        ...createUser(),
      } as StorageInsert<ConformanceUser>);

      await expect(
        adapter.insert<ConformanceUser>(USERS_COLLECTION, {
          id: "duplicate-id",
          ...createUser({ email: "other@example.com" }),
        } as StorageInsert<ConformanceUser>),
      ).rejects.toBeInstanceOf(StorageDuplicateError);
    });

    it("enforces unique normalized email when configured", async () => {
      await reset();

      const adapter = await createAdapter();

      if (!adapter.capabilities.uniqueConstraints) {
        return;
      }

      await adapter.registerCollection<ConformanceUser>({
        name: USERS_COLLECTION,
        indexes: [
          {
            name: "users_normalized_email_unique",
            fields: ["normalizedEmail"],
            unique: true,
          },
        ],
      });

      await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "email-1",
        ...createUser({
          email: "alice@example.com",
          normalizedEmail: "alice@example.com",
        }),
      } as StorageInsert<ConformanceUser>);

      await expect(
        adapter.insert<ConformanceUser>(USERS_COLLECTION, {
          id: "email-2",
          ...createUser({
            email: "ALICE@example.com",
            normalizedEmail: "alice@example.com",
          }),
        } as StorageInsert<ConformanceUser>),
      ).rejects.toBeInstanceOf(StorageDuplicateError);
    });
  });
};
