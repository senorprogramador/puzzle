import { describe, expect, it } from "bun:test";
import {
  StorageDuplicateError,
  StorageValidationError,
  type StorageAdapter,
  type StorageInsert,
} from "../../src";
import {
  createUser,
  USERS_COLLECTION,
  type ConformanceUser,
} from "./storage-adapter.test-types";

export const runCrudConformance = (
  createAdapter: () => Promise<StorageAdapter>,
  reset: () => Promise<void>,
): void => {
  describe("CRUD and query conformance", () => {
    let adapter: StorageAdapter;

    const insertUser = async (
      id: string | undefined,
      overrides: Partial<ConformanceUser> = {},
    ) => {
      const user = createUser(overrides);

      return adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        ...(id === undefined ? {} : { id }),
        ...user,
      });
    };

    it("inserts and reads a record by id", async () => {
      await reset();
      adapter = await createAdapter();

      const inserted = await insertUser("user-1");
      const found = await adapter.findById<ConformanceUser>(
        USERS_COLLECTION,
        "user-1",
      );

      expect(found).not.toBeNull();
      expect(found?.id).toBe(inserted.id);
      expect(found?.email).toBe(inserted.email);
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
      expect(found?.revision).toBe(1);
    });

    it("generates unique, retrievable IDs and applies metadata defaults", async () => {
      await reset();
      adapter = await createAdapter();

      const first = await adapter.insert<ConformanceUser>(
        USERS_COLLECTION,
        createUser(),
      );
      const second = await adapter.insert<ConformanceUser>(
        USERS_COLLECTION,
        createUser({ email: "bob@example.com" }),
      );

      expect(first.id).toBeTypeOf("string");
      expect(first.id.length).toBeGreaterThan(0);
      expect(second.id).not.toBe(first.id);
      expect(first.createdAt).toBeInstanceOf(Date);
      expect(first.updatedAt).toBeInstanceOf(Date);
      expect(first.revision).toBe(1);
      expect(
        await adapter.findById<ConformanceUser>(USERS_COLLECTION, first.id),
      ).toEqual(first);
      expect(
        await adapter.findById<ConformanceUser>(USERS_COLLECTION, second.id),
      ).toEqual(second);
    });

    it("preserves explicit insert metadata", async () => {
      await reset();
      adapter = await createAdapter();
      const createdAt = new Date("2020-01-02T03:04:05.000Z");
      const updatedAt = new Date("2021-02-03T04:05:06.000Z");

      const record = await adapter.insert<ConformanceUser>(USERS_COLLECTION, {
        id: "metadata-preserved",
        createdAt,
        updatedAt,
        revision: 4,
        ...createUser(),
      });

      expect(record.id).toBe("metadata-preserved");
      expect(record.createdAt).toEqual(createdAt);
      expect(record.updatedAt).toEqual(updatedAt);
      expect(record.revision).toBe(4);
    });

    it("returns null when a record does not exist", async () => {
      await reset();
      adapter = await createAdapter();

      const found = await adapter.findById<ConformanceUser>(
        USERS_COLLECTION,
        "missing",
      );

      expect(found).toBeNull();
    });

    it("finds a record by query", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", { normalizedEmail: "alice@example.com" });
      await insertUser("user-2", { normalizedEmail: "bob@example.com" });

      const found = await adapter.findOne<ConformanceUser>(USERS_COLLECTION, {
        where: {
          normalizedEmail: {
            operator: "eq",
            value: "bob@example.com",
          },
        },
      });

      expect(found?.id).toBe("user-2");
    });

    it("returns multiple records", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1");
      await insertUser("user-2");
      await insertUser("user-3");

      const records = await adapter.findMany<ConformanceUser>(USERS_COLLECTION);

      expect(records).toHaveLength(3);
    });

    it("updates a record and increments revision", async () => {
      await reset();
      adapter = await createAdapter();

      const inserted = await insertUser("user-1");

      const updated = await adapter.update<ConformanceUser>(
        USERS_COLLECTION,
        inserted.id,
        { name: "Alice Updated" },
      );

      expect(updated?.name).toBe("Alice Updated");
      expect(updated?.revision).toBe(2);
      expect(updated?.createdAt.getTime()).toBe(inserted.createdAt.getTime());
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
        inserted.updatedAt.getTime(),
      );
    });

    it("does not update the id or createdAt fields", async () => {
      await reset();
      adapter = await createAdapter();

      const inserted = await insertUser("user-1");

      const updated = await adapter.update<ConformanceUser>(
        USERS_COLLECTION,
        inserted.id,
        {
          name: "Updated",
          createdAt: new Date("2000-01-01T00:00:00.000Z"),
        } as never,
      );

      expect(updated?.id).toBe(inserted.id);
      expect(updated?.createdAt.getTime()).toBe(inserted.createdAt.getTime());
    });

    it("returns null when updating a missing record", async () => {
      await reset();
      adapter = await createAdapter();

      const result = await adapter.update<ConformanceUser>(
        USERS_COLLECTION,
        "missing",
        { name: "Updated" },
      );

      expect(result).toBeNull();
    });

    it("deletes a record", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1");

      expect(
        await adapter.delete<ConformanceUser>(USERS_COLLECTION, "user-1"),
      ).toBe(true);

      expect(
        await adapter.findById<ConformanceUser>(USERS_COLLECTION, "user-1"),
      ).toBeNull();
    });

    it("returns false when deleting a missing record", async () => {
      await reset();
      adapter = await createAdapter();

      expect(
        await adapter.delete<ConformanceUser>(USERS_COLLECTION, "missing"),
      ).toBe(false);
    });

    it("upserts a record when no match exists", async () => {
      await reset();
      adapter = await createAdapter();

      const record = await adapter.upsert<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            normalizedEmail: {
              operator: "eq",
              value: "alice@example.com",
            },
          },
        },
        {
          id: "user-1",
          ...createUser(),
        } as StorageInsert<ConformanceUser>,
      );

      expect(record.id).toBe("user-1");
      expect(record.email).toBe("alice@example.com");
    });

    it("generates an ID when upserting a record with no match", async () => {
      await reset();
      adapter = await createAdapter();

      const record = await adapter.upsert<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            normalizedEmail: {
              operator: "eq",
              value: "alice@example.com",
            },
          },
        },
        createUser(),
      );

      expect(record.id).toBeTypeOf("string");
      expect(record.id.length).toBeGreaterThan(0);
      expect(
        await adapter.findById<ConformanceUser>(USERS_COLLECTION, record.id),
      ).toEqual(record);
    });

    it("updates matching records without IDs and protects adapter metadata", async () => {
      await reset();
      adapter = await createAdapter();
      const createdAt = new Date("2020-01-02T03:04:05.000Z");
      const updatedAt = new Date("2021-02-03T04:05:06.000Z");
      const existing = await adapter.insert<ConformanceUser>(
        USERS_COLLECTION,
        {
          id: "upsert-existing",
          createdAt,
          updatedAt,
          revision: 4,
          ...createUser({ age: 30 }),
        },
      );
      const attemptedCreatedAt = new Date("1990-01-01T00:00:00.000Z");
      const attemptedUpdatedAt = new Date("1991-01-01T00:00:00.000Z");
      const query = {
        where: {
          and: [
            {
              normalizedEmail: {
                operator: "eq" as const,
                value: "alice@example.com",
              },
            },
            { age: { operator: "gte" as const, value: 21 } },
          ],
        },
      };

      const updated = await adapter.upsert<ConformanceUser>(
        USERS_COLLECTION,
        query,
        {
          createdAt: attemptedCreatedAt,
          updatedAt: attemptedUpdatedAt,
          revision: 99,
          ...createUser({ name: "Updated Alice", age: 35 }),
        },
      );

      expect(updated.id).toBe(existing.id);
      expect(updated.createdAt).toEqual(createdAt);
      expect(updated.updatedAt.getTime()).toBeGreaterThan(
        existing.updatedAt.getTime(),
      );
      expect(updated.revision).toBe(existing.revision + 1);
      expect(updated.name).toBe("Updated Alice");
    });

    it("rejects an explicit upsert ID that differs from the matched record", async () => {
      await reset();
      adapter = await createAdapter();
      const existing = await insertUser("stable-upsert-id");

      await expect(
        adapter.upsert<ConformanceUser>(
          USERS_COLLECTION,
          {
            where: {
              normalizedEmail: {
                operator: "eq",
                value: existing.normalizedEmail,
              },
            },
          },
          {
            id: "replacement-id",
            ...createUser(),
          },
        ),
      ).rejects.toBeInstanceOf(StorageValidationError);

      expect(
        await adapter.findById<ConformanceUser>(
          USERS_COLLECTION,
          existing.id,
        ),
      ).toEqual(existing);
    });

    it("maps an ID collision on an unmatched upsert to a duplicate error", async () => {
      await reset();
      adapter = await createAdapter();
      await insertUser("already-used");

      await expect(
        adapter.upsert<ConformanceUser>(
          USERS_COLLECTION,
          {
            where: {
              normalizedEmail: {
                operator: "eq",
                value: "bob@example.com",
              },
            },
          },
          {
            id: "already-used",
            ...createUser({
              email: "bob@example.com",
              normalizedEmail: "bob@example.com",
            }),
          },
        ),
      ).rejects.toBeInstanceOf(StorageDuplicateError);
    });

    it("preserves query semantics for AND", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", { age: 18, active: true });
      await insertUser("user-2", { age: 30, active: true });
      await insertUser("user-3", { age: 30, active: false });

      const records = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            and: [
              { age: { operator: "gte", value: 21 } },
              { active: { operator: "eq", value: true } },
            ],
          },
        },
      );

      expect(records.map(({ id }) => id)).toEqual(["user-2"]);
    });

    it("preserves query semantics for OR", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", { age: 18 });
      await insertUser("user-2", { age: 30 });
      await insertUser("user-3", { age: 40 });

      const records = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            or: [
              { age: { operator: "eq", value: 18 } },
              { age: { operator: "eq", value: 40 } },
            ],
          },
        },
      );

      expect(records.map(({ id }) => id).sort()).toEqual(["user-1", "user-3"]);
    });

    it("supports range operators", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", { age: 18 });
      await insertUser("user-2", { age: 25 });
      await insertUser("user-3", { age: 40 });

      const records = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            age: {
              operator: "gte",
              value: 20,
            },
          },
          orderBy: [{ field: "age", direction: "asc" }],
        },
      );

      expect(records.map(({ age }) => age)).toEqual([25, 40]);
    });

    it("supports IN and NOT IN operators", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", { age: 18 });
      await insertUser("user-2", { age: 25 });
      await insertUser("user-3", { age: 40 });
      await insertUser("user-4", { age: 50, nullableValue: "other" });

      const included = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            age: { operator: "in", value: [18, 40] },
          },
        },
      );

      const excluded = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            age: { operator: "notIn", value: [18, 40] },
          },
        },
      );

      expect(included.map(({ age }) => age).sort()).toEqual([18, 40]);
      expect(excluded.map(({ age }) => age).sort()).toEqual([25, 50]);

      const nullValues = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            nullableValue: { operator: "in", value: [null] },
          },
        },
      );
      const nonNullValues = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            nullableValue: { operator: "notIn", value: [null] },
          },
        },
      );
      const notOther = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            nullableValue: { operator: "ne", value: "other" },
          },
        },
      );

      expect(nullValues.map(({ id }) => id).sort()).toEqual([
        "user-1",
        "user-2",
        "user-3",
      ]);
      expect(nonNullValues.map(({ id }) => id)).toEqual(["user-4"]);
      expect(notOther.map(({ id }) => id).sort()).toEqual([
        "user-1",
        "user-2",
        "user-3",
      ]);
    });

    it("supports exists", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", { name: "Present" });

      const records = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            name: { operator: "exists", value: true },
          },
        },
      );

      expect(records).toHaveLength(1);
      expect(
        await adapter.findMany<ConformanceUser>(USERS_COLLECTION, {
          where: {
            nullableValue: { operator: "exists", value: true },
          },
        }),
      ).toHaveLength(1);
      expect(
        await adapter.findMany<ConformanceUser>(USERS_COLLECTION, {
          where: {
            "profile.nickname": { operator: "exists", value: false },
          },
        }),
      ).toHaveLength(1);
    });

    it("filters nested fields and supports string and array contains", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", {
        profile: {
          displayName: "Ada Lovelace",
          score: 12,
          roles: ["author", "reviewer"],
        },
      });
      await insertUser("user-2", {
        profile: {
          displayName: "Grace Hopper",
          score: 20,
          roles: ["admin"],
        },
      });
      await insertUser("user-3", {
        profile: {
          displayName: "Katherine Johnson",
          score: 25,
          roles: ["reviewer"],
        },
      });
      await insertUser("user-4", { scores: [42], flags: [false] });

      const byName = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            "profile.displayName": {
              operator: "contains",
              value: "ADA",
            },
          },
        },
      );
      const byRole = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            "profile.roles": { operator: "contains", value: "reviewer" },
          },
        },
      );
      const byScalarArrayValues = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            scores: { operator: "contains", value: 42 },
            flags: { operator: "contains", value: false },
          },
        },
      );

      expect(byName.map(({ id }) => id)).toEqual(["user-1"]);
      expect(byRole.map(({ id }) => id).sort()).toEqual([
        "user-1",
        "user-3",
        "user-4",
      ]);
      expect(byScalarArrayValues.map(({ id }) => id)).toEqual(["user-4"]);
    });

    it("supports sorting, limit and offset", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", { age: 10 });
      await insertUser("user-2", { age: 20 });
      await insertUser("user-3", { age: 30 });

      const records = await adapter.findMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          orderBy: [{ field: "age", direction: "asc" }],
          offset: 1,
          limit: 1,
        },
      );

      expect(records).toHaveLength(1);
      expect(records[0]?.age).toBe(20);
    });

    it("supports exists and count", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1");
      await insertUser("user-2");

      expect(
        await adapter.exists<ConformanceUser>(USERS_COLLECTION, {
          where: {
            id: { operator: "eq", value: "user-1" },
          },
        }),
      ).toBe(true);

      expect(
        await adapter.exists<ConformanceUser>(USERS_COLLECTION, {
          where: {
            id: { operator: "eq", value: "missing" },
          },
        }),
      ).toBe(false);

      expect(await adapter.count<ConformanceUser>(USERS_COLLECTION)).toBe(2);
    });

    it("supports deleteMany and updateMany", async () => {
      await reset();
      adapter = await createAdapter();

      await insertUser("user-1", { active: false });
      await insertUser("user-2", { active: false });
      await insertUser("user-3", { active: true });

      const updated = await adapter.updateMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            active: { operator: "eq", value: false },
          },
        },
        { active: true },
      );

      expect(updated).toBe(2);

      const deleted = await adapter.deleteMany<ConformanceUser>(
        USERS_COLLECTION,
        {
          where: {
            id: { operator: "in", value: ["user-1", "user-2"] },
          },
        },
      );

      expect(deleted).toBe(2);
      expect(await adapter.count<ConformanceUser>(USERS_COLLECTION)).toBe(1);
    });
  });
};
