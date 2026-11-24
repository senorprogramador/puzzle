import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  StorageValidationError,
  validateQuery,
  validateWhere,
} from "../dist/index.js";

type TestRecord = {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
  profile: {
    displayName: string;
    score: number;
  };
  tags: readonly string[];
};

const invalid = (run: () => void, message: string) => {
  assert.throws(run, { name: "StorageValidationError", message });
};

describe("validateWhere", () => {
  it("accepts nested and/or clauses with every comparison operator", () => {
    const now = new Date("2026-01-02T03:04:05.000Z");

    assert.doesNotThrow(() =>
      validateWhere<TestRecord>({
        and: [
          {
            or: [
              { name: { operator: "eq", value: "Ada" } },
              { active: { operator: "exists", value: true } },
            ],
          },
          {
            createdAt: { operator: "gte", value: now },
            id: { operator: "in", value: ["one", "two"] },
          },
          {
            id: { operator: "notIn", value: [] },
            name: { operator: "ne", value: "Grace" },
          },
          {
            name: { operator: "gt", value: "A" },
            active: { operator: "lt", value: false },
            createdAt: { operator: "lte", value: now },
          },
        ],
      }),
    );
  });

  it("accepts scalar comparison values, nulls, dates, and scalar lists", () => {
    assert.doesNotThrow(() =>
      validateWhere<TestRecord>({
        name: { operator: "eq", value: "Ada" },
        active: { operator: "eq", value: true },
        createdAt: { operator: "eq", value: new Date() },
        id: { operator: "eq", value: null },
        nameContains: { operator: "in", value: ["a", 1, false, null, new Date()] },
      } as never),
    );
  });

  it("accepts validated dotted paths and contains comparisons", () => {
    assert.doesNotThrow(() =>
      validateWhere<TestRecord>({
        "profile.displayName": { operator: "contains", value: "Ada" },
        tags: { operator: "contains", value: "admin" },
      }),
    );
  });

  it("rejects non-array boolean clauses", () => {
    invalid(
      () => validateWhere<TestRecord>({ and: {} } as never),
      'Query operator "and" must be an array.',
    );
    invalid(
      () => validateWhere<TestRecord>({ or: "name" } as never),
      'Query operator "or" must be an array.',
    );
  });

  it("rejects invalid operators, scalar objects, and non-scalar list values", () => {
    invalid(
      () =>
        validateWhere<TestRecord>({
          name: { operator: "matches", value: "Ada" },
        } as never),
      'Invalid comparison for field "name".',
    );
    invalid(
      () =>
        validateWhere<TestRecord>({
          name: { operator: "eq", value: { nested: true } },
        } as never),
      'Invalid comparison for field "name".',
    );
    invalid(
      () =>
        validateWhere<TestRecord>({
          name: { operator: "in", value: ["Ada", { nested: true }] },
        } as never),
      'Invalid comparison for field "name".',
    );
    invalid(
      () =>
        validateWhere<TestRecord>({
          active: { operator: "exists", value: "yes" },
        } as never),
      'Invalid comparison for field "active".',
    );
  });

  it("rejects malformed or unsupported field paths", () => {
    for (const field of [
      "profile..displayName",
      ".name",
      "name.",
      "profile.$where",
      "__proto__.name",
      "id.name",
    ]) {
      assert.throws(
        () =>
          validateWhere<TestRecord>({
            [field]: { operator: "eq", value: "Ada" },
          } as never),
        StorageValidationError,
      );
    }
  });
});

describe("validateQuery", () => {
  it("accepts zero and positive integer pagination with nested conditions", () => {
    assert.doesNotThrow(() =>
      validateQuery<TestRecord>({
        limit: 0,
        offset: 2,
        where: {
          and: [
            { active: { operator: "eq", value: true } },
            { createdAt: { operator: "lt", value: new Date() } },
          ],
        },
      }),
    );
  });

  it("rejects negative, fractional, and infinite limits", () => {
    for (const limit of [-1, 1.5, Infinity]) {
      invalid(
        () => validateQuery<TestRecord>({ limit }),
        "Query limit must be a non-negative integer.",
      );
    }
  });

  it("rejects negative, fractional, and NaN offsets", () => {
    for (const offset of [-1, 0.5, NaN]) {
      invalid(
        () => validateQuery<TestRecord>({ offset }),
        "Query offset must be a non-negative integer.",
      );
    }
  });

  it("validates dotted sort fields and sort directions", () => {
    assert.doesNotThrow(() =>
      validateQuery<TestRecord>({
        orderBy: [{ field: "profile.score", direction: "desc" }],
      }),
    );

    for (const orderBy of [
      [{ field: "profile..score", direction: "asc" }],
      [{ field: "profile.score", direction: "sideways" }],
      [
        { field: "profile.score", direction: "asc" },
        { field: "profile.score", direction: "desc" },
      ],
    ]) {
      assert.throws(
        () => validateQuery<TestRecord>({ orderBy } as never),
        StorageValidationError,
      );
    }
  });

  it("preserves the storage validation error type", () => {
    assert.throws(
      () => validateQuery<TestRecord>({ limit: -1 }),
      StorageValidationError,
    );
  });
});
