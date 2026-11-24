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

const reservedPathSegments = new Set([
  "__proto__",
  "prototype",
  "constructor",
]);

const storageFields = new Set(["id", "createdAt", "updatedAt", "revision"]);

export const validateFieldPath = (field: string): readonly string[] => {
  const segments = field.split(".");

  if (
    segments.length === 0 ||
    segments.length > 6 ||
    segments.some(
      (segment) =>
        !/^[A-Za-z_][A-Za-z0-9_]*$/.test(segment) ||
        reservedPathSegments.has(segment),
    ) ||
    (segments.length > 1 && storageFields.has(segments[0]!))
  ) {
    throw new StorageValidationError(
      `Invalid or unsupported storage field path: "${field}".`,
    );
  }

  return segments;
};

const isComparison = (value: unknown): value is StorageComparison => {
  if (!value || typeof value !== "object") return false;

  const comparison = value as Record<string, unknown>;
  const operators = [
    "eq",
    "ne",
    "contains",
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
  if (typeof where !== "object" || where === null || Array.isArray(where)) {
    throw new StorageValidationError("Query conditions must be an object.");
  }

  for (const [field, value] of Object.entries(where)) {
    if (field === "and" || field === "or") {
      if (!Array.isArray(value)) {
        throw new StorageValidationError(
          `Query operator "${field}" must be an array.`,
        );
      }

      for (const nested of value) {
        if (
          typeof nested !== "object" ||
          nested === null ||
          Array.isArray(nested)
        ) {
          throw new StorageValidationError(
            `Query operator "${field}" must contain condition objects.`,
          );
        }
        validateWhere(nested as StorageWhere<T>);
      }

      continue;
    }

    validateFieldPath(field);

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

  if (query.where !== undefined) validateWhere(query.where);

  if (query.orderBy !== undefined) {
    if (!Array.isArray(query.orderBy)) {
      throw new StorageValidationError("Query orderBy must be an array.");
    }

    const fields = new Set<string>();

    for (const item of query.orderBy) {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof item.field !== "string" ||
        (item.direction !== "asc" && item.direction !== "desc")
      ) {
        throw new StorageValidationError(
          "Each orderBy item must have a valid field and direction.",
        );
      }

      validateFieldPath(item.field);

      if (fields.has(item.field)) {
        throw new StorageValidationError(
          `Query orderBy contains duplicate field "${item.field}".`,
        );
      }

      fields.add(item.field);
    }
  }
};
