import { CmsSchemaError, CmsValidationError } from "./errors";
import type {
  CmsCustomFieldValidator,
  CmsFieldDefinition,
  CmsFieldValidationContext,
  CmsFields,
  CmsSchemaMigration,
  CmsValue,
  ContentTypeDefinition,
} from "./types";
import type { RuntimeCmsFieldDefinition } from "./fields/types";

export type CmsSchemaRegistryOptions = {
  readonly customValidators?: Readonly<Record<string, CmsCustomFieldValidator>>;
};

export type CmsFieldValidationResult = {
  readonly fields: CmsFields;
  readonly issues: readonly import("./errors").CmsValidationIssue[];
};

const asRuntimeField = (
  field: CmsFieldDefinition,
): RuntimeCmsFieldDefinition => field as unknown as RuntimeCmsFieldDefinition;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  (Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null);

const isCmsValue = (value: unknown, seen = new Set<object>()): value is CmsValue => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);

  const valid = Array.isArray(value)
    ? value.every((item) => isCmsValue(item, seen))
    : isPlainObject(value) &&
      Object.values(value).every((item) => isCmsValue(item, seen));

  seen.delete(value);
  return valid;
};

const issue = (
  path: string,
  code: string,
  message: string,
): import("./errors").CmsValidationIssue => ({ path, code, message });

const fieldTypeSet = new Set<string>([
  "text",
  "textarea",
  "richText",
  "number",
  "boolean",
  "date",
  "datetime",
  "email",
  "url",
  "slug",
  "select",
  "multiSelect",
  "media",
  "relationship",
  "repeater",
  "array",
  "object",
  "blocks",
  "json",
  "locale",
  "computed",
  "custom",
]);

const uniqueStrings = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const collectDefinitionIssues = (
  definition: ContentTypeDefinition,
  customValidators: Readonly<Record<string, CmsCustomFieldValidator>>,
): import("./errors").CmsValidationIssue[] => {
  const issues: import("./errors").CmsValidationIssue[] = [];

  if (!definition || typeof definition !== "object") {
    return [issue("definition", "type", "A content type definition is required.")];
  }
  if (
    typeof definition.slug !== "string" ||
    !/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(definition.slug)
  ) {
    issues.push(issue("slug", "format", "Use letters, numbers, underscores, or hyphens."));
  }
  if (typeof definition.name !== "string" || !definition.name.trim()) {
    issues.push(issue("name", "required", "A content type name is required."));
  }
  if (!Number.isInteger(definition.version) || definition.version < 1) {
    issues.push(issue("version", "range", "Schema version must be a positive integer."));
  }

  if (!Array.isArray(definition.fields)) {
    issues.push(issue("fields", "type", "Content type fields must be an array."));
    return issues;
  }

  const validateFields = (
    fields: readonly CmsFieldDefinition[],
    prefix: string,
  ): void => {
    const keys = new Set<string>();

    fields.forEach((field, index) => {
      const path = `${prefix}[${index}]`;
      if (!field || typeof field !== "object") {
        issues.push(issue(path, "type", "A field definition must be an object."));
        return;
      }
      const runtime = asRuntimeField(field);

      if (typeof field.key !== "string" || !/^[A-Za-z][A-Za-z0-9_]*$/.test(field.key)) {
        issues.push(issue(`${path}.key`, "format", "Field keys must be identifier-like."));
      }
      if (typeof field.key === "string" && keys.has(field.key)) {
        issues.push(issue(`${path}.key`, "duplicate", `Field "${field.key}" is duplicated.`));
      }
      if (typeof field.key === "string") keys.add(field.key);
      if (!fieldTypeSet.has(runtime.type)) {
        issues.push(issue(`${path}.type`, "unknown", `Unknown field type "${runtime.type}".`));
      }
      if (typeof field.label !== "string" || !field.label.trim()) {
        issues.push(issue(`${path}.label`, "required", "A field label is required."));
      }
      if (
        field.customValidators?.some(
          (name) => typeof name !== "string" || !customValidators[name],
        )
      ) {
        issues.push(issue(
          `${path}.customValidators`,
          "unknown-validator",
          "Every named custom validator must be provided to the CMS service.",
        ));
      }
      if (
        field.validation?.min !== undefined &&
        !Number.isFinite(field.validation.min)
      ) {
        issues.push(issue(`${path}.validation.min`, "number", "Validation min must be finite."));
      }
      if (
        field.validation?.max !== undefined &&
        !Number.isFinite(field.validation.max)
      ) {
        issues.push(issue(`${path}.validation.max`, "number", "Validation max must be finite."));
      }
      if (
        field.validation?.min !== undefined &&
        field.validation.max !== undefined &&
        field.validation.min > field.validation.max
      ) {
        issues.push(issue(`${path}.validation`, "range", "Validation min cannot exceed max."));
      }
      if (field.validation?.pattern !== undefined) {
        try {
          new RegExp(field.validation.pattern);
        } catch {
          issues.push(issue(`${path}.validation.pattern`, "pattern", "The validation pattern is invalid."));
        }
      }
      for (const [key, value] of Object.entries({
        minLength: runtime.validation?.minLength,
        maxLength: runtime.validation?.maxLength,
      })) {
        if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
          issues.push(issue(`${path}.validation.${key}`, "range", "String length constraints must be non-negative integers."));
        }
      }
      if (
        runtime.validation?.minLength !== undefined &&
        runtime.validation.maxLength !== undefined &&
        runtime.validation.minLength > runtime.validation.maxLength
      ) {
        issues.push(issue(`${path}.validation`, "range", "Minimum string length cannot exceed maximum string length."));
      }
      if (field.options) {
        if (runtime.type !== "select" && runtime.type !== "multiSelect") {
          issues.push(issue(`${path}.options`, "type", "Options are only valid for select fields."));
        }
        const values = field.options.map((option) => JSON.stringify(option.value));
        if (!uniqueStrings(values)) {
          issues.push(issue(`${path}.options`, "duplicate", "Select option values must be unique."));
        }
      }
      if ((runtime.type === "select" || runtime.type === "multiSelect") && !field.options?.length) {
        issues.push(issue(`${path}.options`, "required", "Select fields require at least one option."));
      }
      if (runtime.type === "relationship") {
        if (!field.relation?.targetTypes.length) {
          issues.push(issue(`${path}.relation`, "required", "Relationship fields require target types."));
        }
      } else if (field.relation) {
        issues.push(issue(`${path}.relation`, "type", "Relation configuration is only valid for relationship fields."));
      }
      if (runtime.type === "repeater") {
        if (!field.fields?.length) {
          issues.push(issue(`${path}.fields`, "required", "Repeater fields require nested fields."));
        }
      } else if (runtime.type === "object") {
        if (!Array.isArray(runtime.fields)) {
          issues.push(issue(`${path}.fields`, "required", "Object fields require a nested field map."));
        }
      } else if (field.fields && runtime.type !== "blocks") {
        issues.push(issue(`${path}.fields`, "type", "Nested fields are only valid for repeaters, objects, and blocks."));
      }
      if (runtime.type === "array") {
        if (!runtime.of || typeof runtime.of !== "object") {
          issues.push(issue(`${path}.of`, "required", "Array fields require an item field definition."));
        } else {
          validateFields([runtime.of as CmsFieldDefinition], `${path}.of`);
        }
      } else if (runtime.of) {
        issues.push(issue(`${path}.of`, "type", "Item definitions are only valid for array fields."));
      }
      if (runtime.type === "blocks") {
        if (!field.blocks?.length) {
          issues.push(issue(`${path}.blocks`, "required", "Block fields require at least one block definition."));
        }
        const blockTypes = field.blocks?.map((block) => block.type) ?? [];
        if (!uniqueStrings(blockTypes)) {
          issues.push(issue(`${path}.blocks`, "duplicate", "Block type names must be unique."));
        }
        field.blocks?.forEach((block, blockIndex) =>
          validateFields(block.fields, `${path}.blocks[${blockIndex}].fields`),
        );
      } else if (field.blocks) {
        issues.push(issue(`${path}.blocks`, "type", "Block definitions are only valid for blocks fields."));
      }
      if (field.fields && (runtime.type === "repeater" || runtime.type === "object")) {
        validateFields(field.fields, `${path}.fields`);
      }
      if (
        runtime.type === "computed" &&
        typeof runtime.compute !== "function"
      ) {
        issues.push(issue(`${path}.compute`, "required", "Computed fields require a compute callback."));
      }
      if (
        runtime.type === "computed" &&
        field.defaultValue !== undefined
      ) {
        issues.push(issue(`${path}.defaultValue`, "type", "Computed fields cannot have a default value."));
      }
      if (
        runtime.type === "custom" &&
        (typeof runtime.name !== "string" ||
          !runtime.name.trim() ||
          typeof runtime.is !== "function")
      ) {
        issues.push(issue(`${path}.custom`, "required", "Custom fields require a name and a type guard."));
      }
      if (
        runtime.type === "url" &&
        runtime.protocols !== undefined &&
        (!runtime.protocols.length ||
          runtime.protocols.some((protocol) =>
            typeof protocol !== "string" ||
            !/^[a-z][a-z\d+.-]*:$/i.test(protocol),
          ))
      ) {
        issues.push(issue(`${path}.protocols`, "invalid", "URL protocols must be a non-empty list of protocol names ending in a colon."));
      }
      if (
        field.defaultValue !== undefined &&
        !isCmsValue(field.defaultValue)
      ) {
        issues.push(issue(`${path}.defaultValue`, "serialization", "Defaults must be finite JSON-compatible values."));
      }
      if (
        field.defaultValue !== undefined &&
        isCmsValue(field.defaultValue) &&
        validateValue(
          field,
          field.defaultValue,
          `${path}.defaultValue`,
          Boolean(field.required),
        ).length > 0
      ) {
        issues.push(issue(`${path}.defaultValue`, "invalid-default", "The default value does not match the field definition."));
      }
    });
  };

  validateFields(definition.fields, "fields");

  if (definition.locales) {
    if (!definition.locales.length || !uniqueStrings(definition.locales)) {
      issues.push(issue("locales", "invalid", "Locales must be non-empty and unique."));
    }
    for (const locale of definition.locales) {
      if (!normalizeLocale(locale)) {
        issues.push(issue("locales", "invalid-locale", `Invalid locale "${locale}".`));
      }
    }
  }
  if (
    definition.defaultLocale &&
    (!normalizeLocale(definition.defaultLocale) ||
      (definition.locales && !definition.locales.includes(definition.defaultLocale)))
  ) {
    issues.push(issue("defaultLocale", "invalid-locale", "Default locale must be valid and included in locales."));
  }

  return issues;
};

const validateValue = (
  field: CmsFieldDefinition,
  value: unknown,
  path: string,
  required: boolean,
): import("./errors").CmsValidationIssue[] => {
  const issues: import("./errors").CmsValidationIssue[] = [];
  const runtime = asRuntimeField(field);
  const fieldType = runtime.type;
  const badType = (expected: string): void => {
    issues.push(issue(path, "type", `Expected ${expected}.`));
  };

  if (fieldType === "computed") {
    if (value !== undefined) {
      issues.push(issue(path, "read-only", "Computed fields cannot be written."));
    }
    return issues;
  }

  if (
    value === undefined ||
    value === null ||
    (required &&
      (value === "" || (Array.isArray(value) && value.length === 0)))
  ) {
    if (required) issues.push(issue(path, "required", "This field is required."));
    return issues;
  }

  switch (fieldType) {
    case "text":
    case "textarea":
    case "slug":
    case "date":
    case "datetime":
    case "locale": {
      if (typeof value !== "string") {
        badType("a string");
        break;
      }
      if (fieldType === "date" && !isDateOnly(value)) {
        issues.push(issue(path, "date", "Expected a valid YYYY-MM-DD date."));
      }
      if (fieldType === "datetime" && !Number.isFinite(Date.parse(value))) {
        issues.push(issue(path, "datetime", "Expected a valid datetime string."));
      }
      if (fieldType === "locale" && !normalizeLocale(value)) {
        issues.push(issue(path, "locale", "Expected a valid BCP 47 locale."));
      }
      checkStringValidation(field, value, path, issues);
      break;
    }
    case "email":
      if (typeof value !== "string") {
        badType("an email address");
      } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          issues.push(issue(path, "email", "Expected a valid email address."));
        }
        checkStringValidation(field, value, path, issues);
      }
      break;
    case "url":
      if (typeof value !== "string") {
        badType("a URL");
      } else {
        let valid = false;
        try {
          const parsed = new URL(value);
          valid = (runtime.protocols ?? ["http:", "https:"]).includes(parsed.protocol);
        } catch {
          valid = false;
        }
        if (!valid) {
          issues.push(issue(path, "url", "Expected a valid URL with an allowed protocol."));
        }
        checkStringValidation(field, value, path, issues);
      }
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        badType("a finite number");
      } else {
        checkRange(field, value, path, issues);
      }
      break;
    case "boolean":
      if (typeof value !== "boolean") badType("a boolean");
      break;
    case "select":
      if (!isScalar(value)) {
        badType("a scalar option");
      } else if (!field.options?.some((option) => option.value === value)) {
        issues.push(issue(path, "option", "The selected value is not an allowed option."));
      } else {
        checkAllowedValues(field, value, path, issues);
      }
      break;
    case "multiSelect":
      if (
        !Array.isArray(value) ||
        !value.every(isScalar) ||
        !field.options?.length ||
        value.some((item) => !field.options?.some((option) => option.value === item))
      ) {
        badType("an array of allowed options");
      } else {
        checkRange(field, value.length, path, issues);
        checkAllowedValues(field, value, path, issues);
      }
      break;
    case "media":
      if (typeof value !== "string" || !value.trim()) badType("a non-empty asset ID string");
      break;
    case "relationship": {
      const values = Array.isArray(value) ? value : [value];
      if (
        (Array.isArray(value) && !field.relation?.multiple) ||
        (!Array.isArray(value) && field.relation?.multiple) ||
        values.some((item) => typeof item !== "string" || !item.trim())
      ) {
        badType(field.relation?.multiple ? "an array of entry IDs" : "an entry ID");
      }
      break;
    }
    case "repeater":
      if (!Array.isArray(value)) {
        badType("an array of objects");
        break;
      }
      checkRange(field, value.length, path, issues);
      value.forEach((item, index) => {
        if (!isPlainObject(item)) {
          issues.push(issue(`${path}[${index}]`, "type", "Repeater items must be objects."));
          return;
        }
        const nestedIssues = validateObjectFields(
          field.fields ?? [],
          item,
          `${path}[${index}]`,
        );
        issues.push(...nestedIssues);
      });
      break;
    case "array":
      if (!Array.isArray(value)) {
        badType("an array");
        break;
      }
      checkRange(field, value.length, path, issues);
      if (!runtime.of) {
        issues.push(issue(`${path}.of`, "required", "Array fields require an item field definition."));
        break;
      }
      value.forEach((item, index) => {
        issues.push(
          ...validateValue(
            runtime.of as CmsFieldDefinition,
            item,
            `${path}[${index}]`,
            Boolean(runtime.of?.required),
          ),
        );
      });
      break;
    case "object":
      if (!isPlainObject(value)) {
        badType("an object");
      } else {
        issues.push(
          ...validateObjectFields(
            (runtime.fields ?? []) as readonly CmsFieldDefinition[],
            value,
            path,
          ),
        );
      }
      break;
    case "blocks":
      if (!Array.isArray(value)) {
        badType("an array of content blocks");
        break;
      }
      value.forEach((item, index) => {
        if (!isPlainObject(item) || typeof item.type !== "string" || !isPlainObject(item.fields)) {
          issues.push(issue(`${path}[${index}]`, "type", "Blocks require a type and fields object."));
          return;
        }
        const block = runtime.blocks?.find((candidate) => candidate.type === item.type);
        if (!block) {
          issues.push(issue(`${path}[${index}].type`, "unknown-block", `Unknown block type "${item.type}".`));
          return;
        }
        issues.push(
          ...validateObjectFields(
            block.fields as readonly CmsFieldDefinition[],
            item.fields,
            `${path}[${index}].fields`,
          ),
        );
      });
      break;
    case "richText":
    case "json":
      if (!isCmsValue(value)) {
        badType("a JSON-compatible value");
      } else if (fieldType === "richText" && !isPlainObject(value) && !Array.isArray(value)) {
        badType("a rich-text document object or array");
      }
      break;
    case "custom":
      if (!isCmsValue(value)) {
        issues.push(issue(path, "serialization", "Expected a JSON-compatible value."));
      } else {
        let matches = false;
        try {
          matches = typeof runtime.is === "function" && runtime.is(value);
        } catch {
          matches = false;
        }
        if (!matches) {
          issues.push(issue(path, "type", "Value does not match the custom field type."));
        }
      }
      break;
    default:
      badType("a supported field value");
      break;
  }

  return issues;
};

const checkRange = (
  field: CmsFieldDefinition,
  value: number,
  path: string,
  issues: import("./errors").CmsValidationIssue[],
): void => {
  if (field.validation?.min !== undefined && value < field.validation.min) {
    issues.push(issue(path, "min", `Value must be at least ${field.validation.min}.`));
  }
  if (field.validation?.max !== undefined && value > field.validation.max) {
    issues.push(issue(path, "max", `Value must be at most ${field.validation.max}.`));
  }
};

const checkStringValidation = (
  field: CmsFieldDefinition,
  value: string,
  path: string,
  issues: import("./errors").CmsValidationIssue[],
): void => {
  const validation = asRuntimeField(field).validation;
  checkRange(field, value.length, path, issues);
  if (validation?.minLength !== undefined && value.length < validation.minLength) {
    issues.push(issue(path, "min-length", `Value must contain at least ${validation.minLength} characters.`));
  }
  if (validation?.maxLength !== undefined && value.length > validation.maxLength) {
    issues.push(issue(path, "max-length", `Value must contain at most ${validation.maxLength} characters.`));
  }
  if (validation?.pattern && !new RegExp(validation.pattern).test(value)) {
    issues.push(issue(path, "pattern", "Value does not match the required pattern."));
  }
  checkAllowedValues(field, value, path, issues);
};

const checkAllowedValues = (
  field: CmsFieldDefinition,
  value: CmsValue,
  path: string,
  issues: import("./errors").CmsValidationIssue[],
): void => {
  const allowed = field.validation?.allowedValues;
  if (!allowed) return;
  const values = Array.isArray(value) ? value : [value];
  if (values.some((item) => !allowed.some((allowedValue) => allowedValue === item))) {
    issues.push(issue(path, "allowed-values", "Value contains a value not in the allowed set."));
  }
};

const isScalar = (value: unknown): value is string | number | boolean | null =>
  value === null ||
  typeof value === "string" ||
  typeof value === "boolean" ||
  (typeof value === "number" && Number.isFinite(value));

const isDateOnly = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(`${value}T00:00:00.000Z`)) &&
  new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;

const validateObjectFields = (
  definitions: readonly CmsFieldDefinition[],
  input: Record<string, unknown>,
  prefix: string,
): import("./errors").CmsValidationIssue[] => {
  const issues: import("./errors").CmsValidationIssue[] = [];
  const known = new Set(definitions.map((field) => field.key));
  for (const key of Object.keys(input)) {
    if (!known.has(key)) issues.push(issue(`${prefix}.${key}`, "unknown-field", "Unknown field."));
  }
  for (const field of definitions) {
    const hasValue = Object.prototype.hasOwnProperty.call(input, field.key);
    const value = hasValue ? input[field.key] : field.defaultValue;
    issues.push(
      ...validateValue(
        field,
        value,
        `${prefix}.${field.key}`,
        Boolean(field.required),
      ),
    );
  }
  return issues;
};

const normalizeFieldValue = (
  field: CmsFieldDefinition,
  value: unknown,
): CmsValue | undefined => {
  if (value === undefined) return undefined;
  const runtime = asRuntimeField(field);
  if (runtime.type === "computed") return undefined;
  if (runtime.type === "slug" && typeof value === "string") return normalizeCmsSlug(value);
  if (runtime.type === "locale" && typeof value === "string") return normalizeLocale(value) ?? value;
  if (runtime.type === "array" && Array.isArray(value) && runtime.of) {
    return value.map((item) =>
      normalizeFieldValue(
        runtime.of as CmsFieldDefinition,
        item,
      ) as CmsValue,
    );
  }
  if (runtime.type === "object" && isPlainObject(value)) {
    return normalizeObjectFields(
      (runtime.fields ?? []) as readonly CmsFieldDefinition[],
      value,
    );
  }
  if (runtime.type === "repeater" && Array.isArray(value)) {
    return value.map((item) => {
      if (!isPlainObject(item)) return item as CmsValue;
      return normalizeObjectFields(field.fields ?? [], item);
    });
  }
  if (runtime.type === "blocks" && Array.isArray(value)) {
    return value.map((item) => {
      if (!isPlainObject(item)) return item as CmsValue;
      const block = runtime.blocks?.find((candidate) => candidate.type === item.type);
      if (!block || !isPlainObject(item.fields)) return item as CmsValue;
      return {
        type: block.type,
        fields: normalizeObjectFields(
          block.fields as readonly CmsFieldDefinition[],
          item.fields,
        ),
      };
    });
  }
  return value as CmsValue;
};

const normalizeObjectFields = (
  definitions: readonly CmsFieldDefinition[],
  input: Record<string, unknown>,
): Readonly<Record<string, CmsValue>> => {
  const result: Record<string, CmsValue> = {};
  for (const field of definitions) {
    const value = Object.prototype.hasOwnProperty.call(input, field.key)
      ? input[field.key]
      : field.defaultValue;
    const normalized = normalizeFieldValue(field, value);
    if (normalized !== undefined) result[field.key] = normalized;
  }
  return result;
};

export const normalizeCmsSlug = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

export const normalizeLocale = (locale: string): string | null => {
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? null;
  } catch {
    return null;
  }
};

export const validateContentTypeDefinition = (
  definition: ContentTypeDefinition,
  options: CmsSchemaRegistryOptions = {},
): void => {
  const issues = collectDefinitionIssues(
    definition,
    options.customValidators ?? {},
  );
  if (issues.length) throw new CmsValidationError(issues);
};

export const getBreakingSchemaChanges = (
  previous: ContentTypeDefinition,
  next: ContentTypeDefinition,
): readonly string[] => {
  const changes: string[] = [];
  const checkChildren = (
    oldFields: readonly CmsFieldDefinition[],
    newFields: readonly CmsFieldDefinition[],
    prefix: string,
  ): void => {
    const newByKey = new Map(newFields.map((field) => [field.key, field]));
    for (const oldField of oldFields) {
      const path = `${prefix}${oldField.key}`;
      const newField = newByKey.get(oldField.key);
      if (!newField) {
        changes.push(`${path}: removed`);
        continue;
      }
      const oldRuntime = asRuntimeField(oldField);
      const newRuntime = asRuntimeField(newField);
      if (oldField.type !== newField.type) changes.push(`${path}: type changed`);
      if (Boolean(oldField.localized) !== Boolean(newField.localized)) {
        changes.push(`${path}: localization changed`);
      }
      if (!oldField.required && newField.required && newField.defaultValue === undefined) {
        changes.push(`${path}: became required`);
      }
      if (
        JSON.stringify(oldField.validation ?? null) !==
          JSON.stringify(newField.validation ?? null) ||
        JSON.stringify(oldField.options ?? null) !== JSON.stringify(newField.options ?? null) ||
        JSON.stringify(oldField.relation ?? null) !== JSON.stringify(newField.relation ?? null) ||
        JSON.stringify(oldRuntime.protocols ?? null) !== JSON.stringify(newRuntime.protocols ?? null) ||
        JSON.stringify(oldRuntime.name ?? null) !== JSON.stringify(newRuntime.name ?? null) ||
        JSON.stringify(oldField.customValidators ?? []) !==
          JSON.stringify(newField.customValidators ?? [])
      ) {
        changes.push(`${path}: constraints changed`);
      }
      if (
      (oldRuntime.type === "repeater" || oldRuntime.type === "object") &&
      oldRuntime.type === newRuntime.type
      ) {
      checkChildren(
        (oldRuntime.fields ?? []) as readonly CmsFieldDefinition[],
        (newRuntime.fields ?? []) as readonly CmsFieldDefinition[],
        `${path}.`,
      );
      }
      if (oldRuntime.type === "array" && newRuntime.type === "array") {
      const oldItem = oldRuntime.of;
      const newItem = newRuntime.of;
      if (!oldItem || !newItem) {
        if (oldItem !== newItem) changes.push(`${path}: array item definition changed`);
      } else {
        if (oldItem.type !== newItem.type) changes.push(`${path}[]: item type changed`);
        if (oldItem.type === "object" && newItem.type === "object") {
          checkChildren(
            (oldItem.fields ?? []) as readonly CmsFieldDefinition[],
            (newItem.fields ?? []) as readonly CmsFieldDefinition[],
            `${path}[].`,
          );
        }
      }
      }
      if (oldRuntime.type === "blocks" && newRuntime.type === "blocks") {
      const newBlocks = new Map((newRuntime.blocks ?? []).map((block) => [block.type, block]));
      for (const oldBlock of oldRuntime.blocks ?? []) {
          const newBlock = newBlocks.get(oldBlock.type);
          if (!newBlock) {
            changes.push(`${path}.${oldBlock.type}: block removed`);
          } else {
            checkChildren(
              oldBlock.fields as readonly CmsFieldDefinition[],
              newBlock.fields as readonly CmsFieldDefinition[],
              `${path}.${oldBlock.type}.`,
            );
          }
        }
      }
    }
    for (const newField of newFields) {
      const oldField = oldFields.find((field) => field.key === newField.key);
      if (!oldField && newField.required && newField.defaultValue === undefined) {
        changes.push(`${prefix}${newField.key}: required field added`);
      }
    }
  };
  checkChildren(previous.fields, next.fields, "");
  const previousLocales = previous.locales ?? [];
  const nextLocales = next.locales ?? [];
  const localeScopeNarrowed =
    nextLocales.length > 0 &&
    (previousLocales.length === 0 ||
      previousLocales.some((locale) => !nextLocales.includes(locale)));
  if (localeScopeNarrowed) {
    changes.push("locales: one or more locales removed");
  }
  return [...new Set(changes)];
};

export const validateContentFields = async (
  definition: ContentTypeDefinition,
  input: CmsFields,
  context: Omit<CmsFieldValidationContext, "fieldPath">,
  options: CmsSchemaRegistryOptions = {},
): Promise<CmsFields> => {
  validateContentTypeDefinition(definition, options);
  if (!isPlainObject(input)) {
    throw new CmsValidationError([issue("fields", "type", "Fields must be an object.")]);
  }

  const issues: import("./errors").CmsValidationIssue[] = [];
  const knownKeys = new Set(definition.fields.map((field) => field.key));
  for (const key of Object.keys(input)) {
    if (!knownKeys.has(key)) issues.push(issue(key, "unknown-field", `Unknown field "${key}".`));
  }

  const normalized: Record<string, CmsValue> = {};
  const runCustomValidators = async (
    field: CmsFieldDefinition,
    value: CmsValue | undefined,
    fieldPath: string,
  ): Promise<void> => {
    if (value === undefined) return;
    const runtime = asRuntimeField(field);
    if (runtime.validate) {
      try {
        const message = await runtime.validate(value, {
          ...context,
          path: fieldPath,
        });
        if (typeof message === "string" && message) {
          issues.push(issue(fieldPath, "custom-validation", message));
        }
      } catch {
        issues.push(issue(fieldPath, "custom-validation", "Custom validation failed."));
      }
    }
    for (const name of field.customValidators ?? []) {
      const validator = options.customValidators?.[name];
      if (!validator) {
        issues.push(issue(fieldPath, "unknown-validator", `Custom validator "${name}" is not registered.`));
        continue;
      }
      try {
        const message = await validator(value, {
          ...context,
          fieldPath,
        });
        if (typeof message === "string" && message) {
          issues.push(issue(fieldPath, "custom", message));
        }
      } catch (error) {
        issues.push(issue(
          fieldPath,
          "custom",
          error instanceof Error ? error.message : "Custom validation failed.",
        ));
      }
    }

    if (runtime.type === "object" && isPlainObject(value)) {
      for (const nested of runtime.fields ?? []) {
        await runCustomValidators(
          nested as CmsFieldDefinition,
          value[nested.key] as CmsValue | undefined,
          `${fieldPath}.${nested.key}`,
        );
      }
    } else if (runtime.type === "array" && Array.isArray(value) && runtime.of) {
      for (const [index, item] of value.entries()) {
        await runCustomValidators(
          runtime.of as CmsFieldDefinition,
          item as CmsValue,
          `${fieldPath}[${index}]`,
        );
      }
    } else if (runtime.type === "repeater" && Array.isArray(value)) {
      for (const [index, item] of value.entries()) {
        if (!isPlainObject(item)) continue;
        for (const nested of field.fields ?? []) {
          await runCustomValidators(
            nested,
            item[nested.key] as CmsValue | undefined,
            `${fieldPath}[${index}].${nested.key}`,
          );
        }
      }
    } else if (runtime.type === "blocks" && Array.isArray(value)) {
      for (const [index, item] of value.entries()) {
        if (!isPlainObject(item) || !isPlainObject(item.fields)) continue;
        const block = runtime.blocks?.find((candidate) => candidate.type === item.type);
        for (const nested of block?.fields ?? []) {
          await runCustomValidators(
            nested as CmsFieldDefinition,
            item.fields[nested.key] as CmsValue | undefined,
            `${fieldPath}[${index}].${nested.key}`,
          );
        }
      }
    }
  };
  for (const field of definition.fields) {
    const present = Object.prototype.hasOwnProperty.call(input, field.key);
    const value = present ? input[field.key] : field.defaultValue;
    const fieldPath = field.key;
    issues.push(...validateValue(field, value, fieldPath, Boolean(field.required)));

    if (value !== undefined) {
      const normalizedValue = normalizeFieldValue(field, value);
      if (normalizedValue !== undefined) normalized[field.key] = normalizedValue;
      await runCustomValidators(field, normalizedValue, fieldPath);
    }
  }

  if (issues.length) throw new CmsValidationError(issues);
  return normalized;
};

export class ContentTypeRegistry {
  readonly #customValidators: Readonly<Record<string, CmsCustomFieldValidator>>;
  readonly #definitions = new Map<string, ContentTypeDefinition>();

  constructor(options: CmsSchemaRegistryOptions = {}) {
    this.#customValidators = options.customValidators ?? {};
  }

  register(tenantId: string, definition: ContentTypeDefinition): void {
    validateContentTypeDefinition(definition, {
      customValidators: this.#customValidators,
    });
    const key = `${tenantId}:${definition.slug}`;
    const previous = this.#definitions.get(key);
    if (previous && definition.version < previous.version) {
      throw new CmsSchemaError("Content type schema versions must increase.");
    }
    if (
      previous?.version === definition.version &&
      JSON.stringify(previous) !== JSON.stringify(definition)
    ) {
      throw new CmsSchemaError("A content type cannot change without increasing its schema version.");
    }
    if (previous?.version === definition.version) return;
    this.#definitions.set(key, definition);
  }

  get(tenantId: string, slug: string): ContentTypeDefinition | null {
    return this.#definitions.get(`${tenantId}:${slug}`) ?? null;
  }

  list(tenantId: string): readonly ContentTypeDefinition[] {
    const prefix = `${tenantId}:`;
    return [...this.#definitions]
      .filter(([key]) => key.startsWith(prefix))
      .map(([, definition]) => definition);
  }
}

export const assertMigrationMatches = (
  migration: CmsSchemaMigration,
  definition: ContentTypeDefinition,
  previousVersion: number,
): void => {
  if (
    normalizeCmsSlug(migration.contentTypeSlug) !== definition.slug ||
    migration.fromVersion !== previousVersion ||
    migration.toVersion !== definition.version ||
    migration.toVersion !== migration.fromVersion + 1
  ) {
    throw new CmsSchemaError(
      "A schema migration must match the content type and consecutive schema versions.",
    );
  }
};
