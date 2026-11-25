import type {
  StorageOrder,
  StorageInsert,
  StorageQuery,
  StorageRecord,
  StorageWhere,
} from "../../src";

export type ConformanceUser = StorageRecord & {
  readonly email: string;
  readonly normalizedEmail: string;
  readonly name: string;
  readonly age: number;
  readonly active: boolean;
  readonly tags: readonly string[];
  readonly scores: readonly number[];
  readonly flags: readonly boolean[];
  readonly nullableValue: string | null;
  readonly profile: {
    readonly displayName: string;
    readonly score: number;
    readonly roles: readonly string[];
    readonly nickname?: string;
  };
};

const queryTypeContract = () => {
  const validQuery: StorageQuery<ConformanceUser> = {
    where: {
      "profile.displayName": { operator: "contains", value: "Ada" },
      tags: { operator: "contains", value: "editor" },
      nullableValue: { operator: "eq", value: null },
    },
    orderBy: [{ field: "profile.score", direction: "asc" }],
  };

  const objectFilter: StorageWhere<ConformanceUser> = {
    // @ts-expect-error Container objects are not queryable leaves.
    profile: { operator: "eq", value: "profile" },
  };
  const arrayFilter: StorageWhere<ConformanceUser> = {
    // @ts-expect-error Arrays support contains only.
    tags: { operator: "eq", value: "editor" },
  };
  const objectOrder: StorageOrder<ConformanceUser> = {
    // @ts-expect-error Container objects cannot be sorted.
    field: "profile",
    direction: "asc",
  };
  const arrayOrder: StorageOrder<ConformanceUser> = {
    // @ts-expect-error Arrays cannot be sorted.
    field: "tags",
    direction: "asc",
  };

  return [validQuery, objectFilter, arrayFilter, objectOrder, arrayOrder];
};

void queryTypeContract;

export const USERS_COLLECTION = "conformance_users";

export const createUser = (
  overrides: Partial<
    Omit<ConformanceUser, "id" | "createdAt" | "updatedAt" | "revision">
  > = {},
): Omit<ConformanceUser, "id" | "createdAt" | "updatedAt" | "revision"> => ({
  email: "alice@example.com",
  normalizedEmail: "alice@example.com",
  name: "Alice",
  age: 30,
  active: true,
  tags: ["admin", "test"],
  scores: [1, 2],
  flags: [true],
  nullableValue: null,
  profile: {
    displayName: "Alice Example",
    score: 10,
    roles: ["editor", "reviewer"],
  },
  ...overrides,
});

const insertTypeContract = () => {
  const generatedId: StorageInsert<ConformanceUser> = createUser();
  const explicitId: StorageInsert<ConformanceUser> = {
    id: "explicit-id",
    ...createUser(),
  };

  return [generatedId, explicitId];
};

void insertTypeContract;

const recordTypeContract = () => {
  // @ts-expect-error StorageRecord always requires an ID.
  const missingId: StorageRecord = {
    createdAt: new Date(),
    updatedAt: new Date(),
    revision: 1,
  };

  return missingId;
};

void recordTypeContract;

export const createRecord = (
  id: string,
  overrides: Partial<ConformanceUser> = {},
): ConformanceUser => {
  const now = new Date();

  return {
    id,
    createdAt: now,
    updatedAt: now,
    revision: 1,
    ...createUser(),
    ...overrides,
  };
};
