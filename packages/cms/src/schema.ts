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

export type CmsSchemaRegistryOptions = {
  readonly customValidators?: Readonly<Record<string, CmsCustomFieldValidator>>;
};

export type CmsFieldValidationResult = {
  readonly fields: CmsFields;
  readonly issues: readonly import("./errors").CmsValidationIssue[];
};

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
  "slug",
  "select",
  "multiSelect",
  "media",
  "relationship",
  "repeater",
  "blocks",
  "json",
  "locale",
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

      if (typeof field.key !== "string" || !/^[A-Za-z][A-Za-z0-9_]*$/.test(field.key)) {
        issues.push(issue(`${path}.key`, "format", "Field keys must be identifier-like."));
      }
      if (typeof field.key === "string" && keys.has(field.key)) {
        issues.push(issue(`${path}.key`, "duplicate", `Field "${field.key}" is duplicated.`));
      }
      if (typeof field.key === "string") keys.add(field.key);
      if (!fieldTypeSet.has(field.type)) {
        issues.push(issue(`${path}.type`, "unknown", `Unknown field type "${field.type}".`));
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
      if (field.options) {
        if (field.type !== "select" && field.type !== "multiSelect") {
          issues.push(issue(`${path}.options`, "type", "Options are only valid for select fields."));
        }
        const values = field.options.map((option) => JSON.stringify(option.value));
        if (!uniqueStrings(values)) {
          issues.push(issue(`${path}.options`, "duplicate", "Select option values must be unique."));
        }
      }
      if ((field.type === "select" || field.type === "multiSelect") && !field.options?.length) {
        issues.push(issue(`${path}.options`, "required", "Select fields require at least one option."));
      }
      if (field.type === "relationship") {
        if (!field.relation?.targetTypes.length) {
          issues.push(issue(`${path}.relation`, "required", "Relationship fields require target types."));
        }
      } else if (field.relation) {
        issues.push(issue(`${path}.relation`, "type", "Relation configuration is only valid for relationship fields."));
      }
      if (field.type === "repeater") {
        if (!field.fields?.length) {
          issues.push(issue(`${path}.fields`, "required", "Repeater fields require nested fields."));
        }
      } else if (field.fields && field.type !== "blocks") {
        issues.push(issue(`${path}.fields`, "type", "Nested fields are only valid for repeaters and blocks."));
      }
      if (field.type === "blocks") {
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
      if (field.fields && field.type === "repeater") {
        validateFields(field.fields, `${path}.fields`);
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
  const badType = (expected: string): void => {
    issues.push(issue(path, "type", `Expected ${expected}.`));
  };

  if (
    value === undefined ||
    value === null ||
    (required &&
      (value === "" || (Array.isArray(value) && value.length === 0)))
  ) {
    if (required) issues.push(issue(path, "required", "This field is required."));
    return issues;
  }

  switch (field.type) {
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
      if (field.type === "date" && !isDateOnly(value)) {
        issues.push(issue(path, "date", "Expected a valid YYYY-MM-DD date."));
      }
      if (field.type === "datetime" && !Number.isFinite(Date.parse(value))) {
        issues.push(issue(path, "datetime", "Expected a valid datetime string."));
      }
      if (field.type === "locale" && !normalizeLocale(value)) {
        issues.push(issue(path, "locale", "Expected a valid BCP 47 locale."));
      }
      checkStringValidation(field, value, path, issues);
      break;
    }
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
        const block = field.blocks?.find((candidate) => candidate.type === item.type);
        if (!block) {
          issues.push(issue(`${path}[${index}].type`, "unknown-block", `Unknown block type "${item.type}".`));
          return;
        }
        issues.push(...validateObjectFields(block.fields, item.fields, `${path}[${index}].fields`));
      });
      break;
    case "richText":
    case "json":
      if (!isCmsValue(value)) {
        badType("a JSON-compatible value");
      } else if (field.type === "richText" && !isPlainObject(value) && !Array.isArray(value)) {
        badType("a rich-text document object or array");
      }
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
  checkRange(field, value.length, path, issues);
  if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
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
  if (field.type === "slug" && typeof value === "string") return normalizeCmsSlug(value);
  if (field.type === "locale" && typeof value === "string") return normalizeLocale(value) ?? value;
  if (field.type === "repeater" && Array.isArray(value)) {
    return value.map((item) => {
      if (!isPlainObject(item)) return item as CmsValue;
      return normalizeObjectFields(field.fields ?? [], item);
    });
  }
  if (field.type === "blocks" && Array.isArray(value)) {
    return value.map((item) => {
      if (!isPlainObject(item)) return item as CmsValue;
      const block = field.blocks?.find((candidate) => candidate.type === item.type);
      if (!block || !isPlainObject(item.fields)) return item as CmsValue;
      return {
        type: block.type,
        fields: normalizeObjectFields(block.fields, item.fields),
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
        JSON.stringify(oldField.customValidators ?? []) !==
          JSON.stringify(newField.customValidators ?? [])
      ) {
        changes.push(`${path}: constraints changed`);
      }
      if (oldField.type === "repeater" && newField.type === "repeater") {
        checkChildren(oldField.fields ?? [], newField.fields ?? [], `${path}.`);
      }
      if (oldField.type === "blocks" && newField.type === "blocks") {
        const newBlocks = new Map((newField.blocks ?? []).map((block) => [block.type, block]));
        for (const oldBlock of oldField.blocks ?? []) {
          const newBlock = newBlocks.get(oldBlock.type);
          if (!newBlock) {
            changes.push(`${path}.${oldBlock.type}: block removed`);
          } else {
            checkChildren(
              oldBlock.fields,
              newBlock.fields,
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

    if (field.type === "repeater" && Array.isArray(value)) {
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
    } else if (field.type === "blocks" && Array.isArray(value)) {
      for (const [index, item] of value.entries()) {
        if (!isPlainObject(item) || !isPlainObject(item.fields)) continue;
        const block = field.blocks?.find((candidate) => candidate.type === item.type);
        for (const nested of block?.fields ?? []) {
          await runCustomValidators(
            nested,
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
