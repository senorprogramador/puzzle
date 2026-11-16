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
          name: { operator: "contains", value: "Ada" },
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

  it("preserves the storage validation error type", () => {
    assert.throws(
      () => validateQuery<TestRecord>({ limit: -1 }),
      StorageValidationError,
    );
  });
});
