import type { CmsFields, CmsValue } from "@puzzle-ui/cms";
import type { CmsEntryListItem } from "./cms.types";

const errorMessage = (error: unknown) =>
  error instanceof Error && error.message
    ? error.message
    : typeof error === "string" && error
      ? error
      : "The action could not be completed.";

const scalarLabel = (value: CmsValue | undefined, fallback: string) => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
};

const entryTitle = (entry: CmsEntryListItem) =>
  scalarLabel(entry.fields.title, entry.slug || entry.id);

const formatDate = (value: Date | string | null | undefined) => {
  if (!value) return "Not scheduled";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const dateTimeAttribute = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const isJsonValue = (value: unknown): value is CmsValue =>
  value === null ||
  typeof value === "string" ||
  (typeof value === "number" && Number.isFinite(value)) ||
  typeof value === "boolean" ||
  (Array.isArray(value) && value.every(isJsonValue)) ||
  (typeof value === "object" &&
    value !== null &&
    Object.values(value).every(isJsonValue));

const isCmsFields = (value: unknown): value is CmsFields =>
  isJsonValue(value) &&
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value);

export {
  errorMessage,
  scalarLabel,
  entryTitle,
  formatDate,
  dateTimeAttribute,
  isJsonValue,
  isCmsFields,
};
