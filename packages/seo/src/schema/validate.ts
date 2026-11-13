import type {
  JsonObject,
  SeoValidationIssue,
  SeoValidationResult,
} from "../core/types";
import type {
  SchemaPropertyDefinition,
  SchemaRegistry,
  SchemaValidationOptions,
} from "./types";

type SchemaNode = Record<string, unknown>;

const normalizeType = (type: string): string =>
  type.replace(/^http:\/\/schema\.org\//, "https://schema.org/");

const getNodeTypes = (node: SchemaNode): string[] => {
  const value = node["@type"];
  const types = Array.isArray(value) ? value : [value];

  return types.filter(
    (type): type is string =>
      typeof type === "string" && type.trim().length > 0,
  );
};

const getExpectedTypes = (property: SchemaPropertyDefinition): string[] => {
  const types =
    property.expectedTypes ??
    property.rangeTypes ??
    (Array.isArray(property.type) ? property.type : [property.type]);

  return types.map(normalizeType);
};

const getLocalTypeName = (type: string): string =>
  normalizeType(type).split(/[\/#]/).at(-1) ?? type;

const matchesPrimitiveType = (
  value: unknown,
  expectedType: string,
): boolean => {
  const type = getLocalTypeName(expectedType);

  switch (type) {
    case "Text":
    case "URL":
    case "CssSelector":
    case "XPath":
    case "Date":
    case "DateTime":
    case "Time":
    case "Duration":
    case "Number":
    case "Integer":
    case "Float":
    case "Boolean":
      break;
    default:
      return false;
  }

  switch (type) {
    case "Text":
    case "URL":
    case "CssSelector":
    case "XPath":
    case "Date":
    case "DateTime":
    case "Time":
    case "Duration":
      return typeof value === "string";

    case "Number":
    case "Integer":
    case "Float":
      return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        (type !== "Integer" || Number.isInteger(value))
      );

    case "Boolean":
      return typeof value === "boolean";

    default:
      return false;
  }
};

const matchesExpectedType = (
  value: unknown,
  expectedTypes: readonly string[],
  registry: SchemaRegistry,
): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) =>
      matchesExpectedType(item, expectedTypes, registry),
    );
  }

  if (typeof value !== "object") {
    return expectedTypes.some((expectedType) =>
      matchesPrimitiveType(value, expectedType),
    );
  }

  const objectValue = value as SchemaNode;
  const actualTypes = getNodeTypes(objectValue);

  // A reference with only @id does not provide enough information to
  // validate its concrete type. It is therefore accepted.
  if (actualTypes.length === 0) {
    return typeof objectValue["@id"] === "string";
  }

  return actualTypes.some((actualType) =>
    expectedTypes.some((expectedType) => {
      try {
        return registry.isTypeOf(actualType, expectedType);
      } catch {
        return normalizeType(actualType) === normalizeType(expectedType);
      }
    }),
  );
};

const createIssue = (
  code: string,
  message: string,
  severity: SeoValidationIssue["severity"],
  property?: string,
): SeoValidationIssue => ({
  code,
  message,
  severity,
  ...(property ? { property, path: `$.${property}` } : {}),
});

/**
 * Validates a Schema.org node against a schema registry.
 *
 * Defaults:
 * - Unknown properties are allowed in non-strict mode.
 * - Unknown properties are rejected in strict mode.
 * - Required properties are not checked unless explicitly enabled.
 *
 * The function is deliberately non-mutating. It does not normalize or modify
 * the supplied node.
 */
export const validateSchemaNode = (
  node: JsonObject | SchemaNode,
  registry: SchemaRegistry,
  options: SchemaValidationOptions = {},
): SeoValidationResult => {
  const strict = options.strict ?? false;
  const allowUnknownProperties = options.allowUnknownProperties ?? !strict;
  const validateRequiredProperties =
    options.validateRequiredProperties ?? false;

  const issues: SeoValidationIssue[] = [];
  const schemaNode = node as SchemaNode;
  const nodeTypes = getNodeTypes(schemaNode);

  if (nodeTypes.length === 0) {
    issues.push(
      createIssue(
        "missing-type",
        "The Schema.org node must have a non-empty @type.",
        "error",
      ),
    );

    return {
      valid: false,
      issues,
    };
  }

  const knownTypes = nodeTypes.filter((type) => registry.has(type));

  for (const type of nodeTypes) {
    if (registry.has(type)) {
      continue;
    }

    issues.push(
      createIssue(
        "unknown-type",
        `Unknown Schema.org type: ${type}.`,
        strict ? "error" : "warning",
      ),
    );
  }

  // Without a known type, property validation cannot be performed reliably.
  if (knownTypes.length === 0) {
    return {
      valid: !issues.some((issue) => issue.severity === "error"),
      issues,
    };
  }

  const allowedProperties = new Map<string, SchemaPropertyDefinition>();

  for (const type of knownTypes) {
    for (const property of registry.getProperties(type)) {
      // Preserve the first definition encountered. Registry inheritance
      // already resolves parent/child property overrides.
      if (!allowedProperties.has(property.name)) {
        allowedProperties.set(property.name, property);
      }
    }
  }

  const suppliedProperties = new Set(
    Object.keys(schemaNode).filter((key) => !key.startsWith("@")),
  );

  for (const propertyName of suppliedProperties) {
    const definition = allowedProperties.get(propertyName);

    if (!definition) {
      if (!allowUnknownProperties) {
        issues.push(
          createIssue(
            "unknown-property",
            `Property "${propertyName}" is not defined for ${nodeTypes.join(", ")}.`,
            "error",
            propertyName,
          ),
        );
      }

      continue;
    }

    const value = schemaNode[propertyName];

    if (value === undefined || value === null) {
      continue;
    }

    if (
      definition.multiple === false &&
      Array.isArray(value) &&
      value.length > 1
    ) {
      issues.push(
        createIssue(
          "property-not-multiple",
          `Property "${propertyName}" does not accept multiple values.`,
          "error",
          propertyName,
        ),
      );

      continue;
    }

    const expectedTypes = getExpectedTypes(definition);

    if (
      expectedTypes.length > 0 &&
      !matchesExpectedType(value, expectedTypes, registry)
    ) {
      issues.push(
        createIssue(
          "invalid-property-value",
          `Property "${propertyName}" expects ${expectedTypes.join(" or ")}.`,
          "error",
          propertyName,
        ),
      );
    }
  }

  if (validateRequiredProperties) {
    for (const [propertyName, definition] of allowedProperties) {
      if (!definition.required) {
        continue;
      }

      if (
        !Object.prototype.hasOwnProperty.call(schemaNode, propertyName) ||
        schemaNode[propertyName] === undefined ||
        schemaNode[propertyName] === null
      ) {
        issues.push(
          createIssue(
            "missing-required-property",
            `Required property "${propertyName}" is missing.`,
            "error",
            propertyName,
          ),
        );
      }
    }
  }

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
};
