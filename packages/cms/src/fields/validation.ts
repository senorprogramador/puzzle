import {
  type FieldDescriptor,
  type FieldMap,
  type FieldValidationContext,
  type FieldValidationIssue,
  type SelectOption,
  type FieldValidator,
} from "./types";
import { isCmsValue, isPlainObject } from "./serialization";

export type FieldValidationContextInput = Omit<FieldValidationContext, "fieldPath"> & {
  readonly fieldPath?: string;
  readonly path?: string;
};

const isArray = (value: unknown): value is readonly unknown[] =>
  Array.isArray(value);

const isOptionValue = (
  options: readonly SelectOption[],
  value: unknown,
): value is string | number | boolean =>
  options.some((option) => option.value === value);

const isOptionValues = (
  options: readonly SelectOption[],
  value: unknown,
): value is readonly (string | number | boolean)[] =>
  isArray(value) && value.every((item) => isOptionValue(options, item));

const makeIssue = (
  path: string,
  code: string,
  message: string,
): FieldValidationIssue => ({ path, code, message });

const checkNumericBounds = (
  value: number,
  field: FieldDescriptor,
  path: string,
  issues: FieldValidationIssue[],
): void => {
  if (field.validation?.min !== undefined && value < field.validation.min) {
    issues.push(makeIssue(path, "min", `Value must be at least ${field.validation.min}.`));
  }
  if (field.validation?.max !== undefined && value > field.validation.max) {
    issues.push(makeIssue(path, "max", `Value must be at most ${field.validation.max}.`));
  }
};

const checkStringBounds = (
  value: string,
  field: FieldDescriptor,
  path: string,
  issues: FieldValidationIssue[],
): void => {
  const { minLength, maxLength, pattern } = field.validation ?? {};
  if (minLength !== undefined && value.length < minLength) {
    issues.push(makeIssue(path, "min-length", `Value must contain at least ${minLength} characters.`));
  }
  if (maxLength !== undefined && value.length > maxLength) {
    issues.push(makeIssue(path, "max-length", `Value must contain at most ${maxLength} characters.`));
  }
  if (pattern !== undefined) {
    try {
      if (!new RegExp(pattern).test(value)) {
        issues.push(makeIssue(path, "pattern", "Value does not match the required pattern."));
      }
    } catch {
      issues.push(makeIssue(path, "invalid-pattern", "The validation pattern is invalid."));
    }
  }
};

const isDateOnly = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidUrl = (
  value: string,
  protocols: readonly string[] | undefined,
): boolean => {
  try {
    const parsed = new URL(value);
    return (protocols ?? ["http:", "https:"]).some((protocol) => {
      const normalized = protocol.endsWith(":") ? protocol : `${protocol}:`;
      return normalized.toLowerCase() === parsed.protocol;
    });
  } catch {
    return false;
  }
};

const childPath = (parent: string, child: string): string =>
  parent ? `${parent}.${child}` : child;

const validateCallback = async (
  validator: FieldValidator<unknown> | undefined,
  value: unknown,
  context: FieldValidationContext,
): Promise<readonly FieldValidationIssue[]> => {
  if (!validator) return [];
  try {
    const result = await validator(value, context);
    return typeof result === "string"
      ? [makeIssue(context.fieldPath ?? context.path ?? "", "custom-validation", result)]
      : [];
  } catch {
    return [
      makeIssue(
        context.fieldPath ?? context.path ?? "",
        "custom-validation",
        "Custom validation failed.",
      ),
    ];
  }
};

const validateMap = async (
  fields: FieldMap,
  value: unknown,
  context: FieldValidationContextInput,
): Promise<readonly FieldValidationIssue[]> => {
  const path = context.path ?? context.fieldPath ?? "";
  if (!isPlainObject(value)) {
    return [makeIssue(path, "type", "Expected an object.")];
  }
  if (!isCmsValue(value)) {
    return [makeIssue(path, "serialization", "Expected a JSON-compatible object.")];
  }

  const issues: FieldValidationIssue[] = [];
  for (const key of Object.keys(fields)) {
    const field = fields[key];
    const fieldPath = childPath(path, key);
    const fieldValue = value[key];
    if (!field) {
      issues.push(makeIssue(fieldPath, "schema", "Field descriptor is missing."));
      continue;
    }

    if (field.type === "computed") {
      if (fieldValue !== undefined) {
        issues.push(makeIssue(fieldPath, "read-only", "Computed fields cannot be written."));
      }
      continue;
    }

    if (fieldValue === undefined) {
      if (field.defaultValue !== undefined) {
        const defaultIssues = await validateFieldValue(field, field.defaultValue, {
          ...context,
          path: fieldPath,
          fieldPath,
        });
        issues.push(
          ...defaultIssues.map((defaultIssue) =>
            makeIssue(
              defaultIssue.path,
              "invalid-default",
              defaultIssue.message,
            ),
          ),
        );
      } else if (field.required === true) {
        issues.push(makeIssue(fieldPath, "required", "This field is required."));
      }
      continue;
    }

    issues.push(
      ...(await validateFieldValue(field, fieldValue, {
        ...context,
        path: fieldPath,
        fieldPath,
      })),
    );
  }

  for (const key of Object.keys(value)) {
    if (!Object.hasOwn(fields, key)) {
      issues.push(makeIssue(childPath(path, key), "unknown-field", "This field is not defined."));
    }
  }
  return issues;
};

export const validateFieldMap = (
  fields: FieldMap,
  value: unknown,
  context: FieldValidationContextInput = {},
): Promise<readonly FieldValidationIssue[]> => validateMap(fields, value, context);

export const validateFieldValue = async (
  field: FieldDescriptor,
  value: unknown,
  context: FieldValidationContextInput = {},
): Promise<readonly FieldValidationIssue[]> => {
  const path = context.path ?? context.fieldPath ?? "";
  const validationContext: FieldValidationContext = {
    ...context,
    path,
    fieldPath: context.fieldPath ?? path,
  };
  const issues: FieldValidationIssue[] = [];

  if (
    value === undefined ||
    value === null ||
    (field.required === true &&
      (value === "" || (isArray(value) && value.length === 0)))
  ) {
    if (field.required === true) {
      issues.push(makeIssue(path, "required", "This field is required."));
    }
    return issues;
  }
  if (!isCmsValue(value)) {
    return [makeIssue(path, "serialization", "Expected a JSON-compatible value.")];
  }

  switch (field.type) {
    case "text":
    case "textarea":
    case "slug":
    case "date":
    case "datetime":
    case "email":
    case "url": {
      if (typeof value !== "string") {
        issues.push(makeIssue(path, "type", "Expected a string."));
        break;
      }
      if (field.type === "date" && !isDateOnly(value)) {
        issues.push(makeIssue(path, "date", "Expected a valid YYYY-MM-DD date."));
      } else if (
        field.type === "datetime" &&
        (!Number.isFinite(Date.parse(value)) || !/[T ]/.test(value))
      ) {
        issues.push(makeIssue(path, "datetime", "Expected a valid datetime string."));
      } else if (field.type === "email" && !isValidEmail(value)) {
        issues.push(makeIssue(path, "email", "Expected a valid email address."));
      } else if (
        field.type === "url" &&
        !isValidUrl(value, field.protocols)
      ) {
        issues.push(makeIssue(path, "url", "Expected a valid URL with an allowed protocol."));
      }
      checkStringBounds(value, field, path, issues);
      issues.push(...(await validateCallback(field.validate, value, validationContext)));
      break;
    }
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        issues.push(makeIssue(path, "type", "Expected a finite number."));
      } else {
        checkNumericBounds(value, field, path, issues);
        if (
          field.step !== undefined &&
          field.step > 0 &&
          Math.abs(value / field.step - Math.round(value / field.step)) > 1e-8
        ) {
          issues.push(makeIssue(path, "step", `Value must use increments of ${field.step}.`));
        }
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
    case "boolean":
      if (typeof value !== "boolean") {
        issues.push(makeIssue(path, "type", "Expected a boolean."));
      } else {
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
    case "select":
      if (!isOptionValue(field.options, value)) {
        issues.push(makeIssue(path, "option", "The selected value is not an allowed option."));
      } else {
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
    case "multiSelect":
      if (
        !isOptionValues(field.options, value)
      ) {
        issues.push(makeIssue(path, "option", "Expected an array of allowed options."));
      } else {
        checkNumericBounds(value.length, field, path, issues);
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
    case "media":
      if (typeof value !== "string" || !value.trim()) {
        issues.push(makeIssue(path, "type", "Expected a non-empty asset ID string."));
      } else {
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
    case "relationship": {
      const valid = field.multiple
        ? isArray(value) &&
          value.every((item) => typeof item === "string" && item.trim().length > 0)
        : typeof value === "string" && value.trim().length > 0;
      if (!valid) {
        issues.push(makeIssue(
          path,
          "type",
          field.multiple ? "Expected an array of entry IDs." : "Expected an entry ID.",
        ));
      } else {
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
    }
    case "richText":
      if (!isCmsValue(value) || (!Array.isArray(value) && !isPlainObject(value))) {
        issues.push(makeIssue(path, "type", "Expected a JSON-compatible rich-text document."));
      } else {
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
    case "json":
    case "computed":
      if (!isCmsValue(value)) {
        issues.push(makeIssue(path, "serialization", "Expected a JSON-compatible value."));
      } else {
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
    case "array":
      if (!isArray(value)) {
        issues.push(makeIssue(path, "type", "Expected an array."));
        break;
      }
      checkNumericBounds(value.length, field, path, issues);
      for (const [index, item] of value.entries()) {
        issues.push(
          ...(await validateFieldValue(field.of, item, {
            ...context,
            path: `${path}[${index}]`,
            fieldPath: `${path}[${index}]`,
          })),
        );
      }
      issues.push(...(await validateCallback(field.validate, value, validationContext)));
      break;
    case "object":
      issues.push(...(await validateMap(field.fields, value, context)));
      issues.push(...(await validateCallback(field.validate, value, validationContext)));
      break;
    case "blocks":
      if (!isArray(value)) {
        issues.push(makeIssue(path, "type", "Expected an array of content blocks."));
        break;
      }
      for (const [index, item] of value.entries()) {
        const blockPath = `${path}[${index}]`;
        if (!isPlainObject(item) || typeof item.type !== "string") {
          issues.push(makeIssue(blockPath, "type", "A block requires a type and fields."));
          continue;
        }
        const block = field.blocks.find((candidate) => candidate.type === item.type);
        if (!block) {
          issues.push(makeIssue(
            `${blockPath}.type`,
            "unknown-block",
            `Unknown block type "${item.type}".`,
          ));
          continue;
        }
        if (!isPlainObject(item.fields)) {
          issues.push(makeIssue(
            `${blockPath}.fields`,
            "type",
            "Block fields must be an object.",
          ));
          continue;
        }
        for (const key of Object.keys(item)) {
          if (key !== "type" && key !== "fields") {
            issues.push(makeIssue(
              childPath(blockPath, key),
              "unknown-field",
              "This block property is not defined.",
            ));
          }
        }
        issues.push(
          ...(await validateMap(block.fields, item.fields, {
            ...context,
            path: childPath(blockPath, "fields"),
            fieldPath: childPath(blockPath, "fields"),
          })),
        );
      }
      issues.push(...(await validateCallback(field.validate, value, validationContext)));
      break;
    case "custom":
      if (!isCmsValue(value) || !field.is(value)) {
        issues.push(makeIssue(path, "type", "Value does not match the custom field type."));
      } else {
        issues.push(...(await validateCallback(field.validate, value, validationContext)));
      }
      break;
  }

  return issues;
};
