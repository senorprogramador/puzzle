import type { CmsValue } from "../types";

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  (Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null);

export const isCmsValue = (
  value: unknown,
  seen: Set<object> = new Set<object>(),
): value is CmsValue => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || seen.has(value)) return false;

  seen.add(value);
  const valid = Array.isArray(value)
    ? value.every((item: unknown) => isCmsValue(item, seen))
    : isPlainObject(value) &&
      Object.values(value).every((item) => isCmsValue(item, seen));
  seen.delete(value);
  return valid;
};
