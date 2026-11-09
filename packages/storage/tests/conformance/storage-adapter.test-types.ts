import type { StorageRecord } from "../../src";

export type ConformanceUser = StorageRecord & {
  readonly email: string;
  readonly normalizedEmail: string;
  readonly name: string;
  readonly age: number;
  readonly active: boolean;
  readonly tags: readonly string[];
  readonly nullableValue: string | null;
};

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
  nullableValue: null,
  ...overrides,
});

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
