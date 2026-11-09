import type { StorageRecord, StorageScalar } from "../types/collection.types";
import type {
  StorageComparison,
  StorageQuery,
  StorageWhere,
} from "../types/query.types";
import { StorageValidationError } from "../errors/storage.errors";

const isScalar = (value: unknown): value is StorageScalar =>
  value === null ||
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean" ||
  value instanceof Date;

const isComparison = (value: unknown): value is StorageComparison => {
  if (!value || typeof value !== "object") return false;

  const comparison = value as Record<string, unknown>;
  const operators = [
    "eq",
    "ne",
    "in",
    "notIn",
    "gt",
    "gte",
    "lt",
    "lte",
    "exists",
  ];

  if (!operators.includes(String(comparison.operator))) return false;

  if (comparison.operator === "in" || comparison.operator === "notIn") {
    return Array.isArray(comparison.value) && comparison.value.every(isScalar);
  }

  if (comparison.operator === "exists") {
    return typeof comparison.value === "boolean";
  }

  return isScalar(comparison.value);
};

export const validateWhere = <T extends object>(
  where: StorageWhere<T>,
): void => {
  for (const [field, value] of Object.entries(where)) {
    if (field === "and" || field === "or") {
      if (!Array.isArray(value)) {
        throw new StorageValidationError(
          `Query operator "${field}" must be an array.`,
        );
      }

      for (const nested of value) {
        validateWhere(nested as StorageWhere<T>);
      }

      continue;
    }

    if (!isComparison(value)) {
      throw new StorageValidationError(
        `Invalid comparison for field "${field}".`,
      );
    }
  }
};

export const validateQuery = <T extends StorageRecord>(
  query: StorageQuery<T>,
): void => {
  if (query.limit !== undefined) {
    if (!Number.isInteger(query.limit) || query.limit < 0) {
      throw new StorageValidationError(
        "Query limit must be a non-negative integer.",
      );
    }
  }

  if (query.offset !== undefined) {
    if (!Number.isInteger(query.offset) || query.offset < 0) {
      throw new StorageValidationError(
        "Query offset must be a non-negative integer.",
      );
    }
  }

  if (query.where) validateWhere(query.where);
};
