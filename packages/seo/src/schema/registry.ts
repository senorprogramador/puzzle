import type {
  SchemaDefinition,
  SchemaEnumerationValue,
  SchemaPropertyDefinition,
  SchemaRegistry,
  SchemaRegistryConflict,
  SchemaRegistryOptions,
} from "./types";

const normalizeType = (type: string): string => {
  const value = type.trim();

  if (!value) {
    throw new Error("Schema type cannot be empty.");
  }

  return /^[A-Za-z][A-Za-z0-9]*$/.test(value)
    ? `https://schema.org/${value}`
    : value.replace(/^http:\/\/schema\.org\//, "https://schema.org/");
};

const isRdfVocabularyType = (type: string): boolean =>
  /^https?:\/\/www\.w3\.org\/(1999\/02\/22-rdf-syntax-ns|2000\/01\/rdf-schema)#/.test(
    type,
  );

/**
 * Recursively freezes registry-owned objects and arrays.
 *
 * Definitions are normalized into new objects before reaching this function,
 * so freezing them never mutates the caller's original input objects.
 */
const deepFreeze = <T>(value: T): T => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return value;
};

const normalizeEnumerationValue = (
  value: SchemaEnumerationValue,
): SchemaEnumerationValue => ({
  ...value,
  type: normalizeType(value.type),
});

const normalizeProperty = (
  property: SchemaPropertyDefinition,
): SchemaPropertyDefinition => ({
  ...property,
  expectedTypes: property.expectedTypes?.map(normalizeType),
  rangeTypes: property.rangeTypes?.map(normalizeType),
  domainTypes: property.domainTypes?.map(normalizeType),
  inverseOf: property.inverseOf ? normalizeType(property.inverseOf) : undefined,
  supersededBy: property.supersededBy
    ? normalizeType(property.supersededBy)
    : undefined,
  type: Array.isArray(property.type)
    ? property.type.map(normalizeType)
    : normalizeType(property.type),
});

/**
 * Normalizes a definition and assigns its authoritative source.
 *
 * The source is determined by the collection the definition came from,
 * never by the caller-provided source property.
 */
const normalizeDefinition = (
  definition: SchemaDefinition,
  source: SchemaDefinition["source"],
): SchemaDefinition => ({
  ...definition,
  type: normalizeType(definition.type),
  source,
  parentTypes: definition.parentTypes?.map(normalizeType),
  enumerationValues: definition.enumerationValues?.map(
    normalizeEnumerationValue,
  ),
  properties: definition.properties?.map(normalizeProperty),
});

const deduplicateProperties = (
  definitions: Iterable<SchemaDefinition>,
  conflicts: SchemaRegistryConflict[],
): void => {
  for (const definition of definitions) {
    const seen = new Set<string>();

    definition.properties = definition.properties?.filter((property) => {
      if (seen.has(property.name)) {
        conflicts.push({
          type: definition.type,
          property: property.name,
          code: "duplicate-property",
          message: `Duplicate property ${property.name} on ${definition.type}.`,
        });

        return false;
      }

      seen.add(property.name);
      return true;
    });
  }
};

export const createSchemaRegistry = (
  options: SchemaRegistryOptions = {},
): SchemaRegistry => {
  // Collection membership is the source of truth. Ignore any source value
  // supplied by callers to prevent custom definitions impersonating generated
  // definitions (or vice versa).
  const generated = (options.generated ?? []).map((definition) =>
    normalizeDefinition(definition, "generated"),
  );

  const custom = (options.custom ?? []).map((definition) =>
    normalizeDefinition(definition, "custom"),
  );

  const conflicts: SchemaRegistryConflict[] = [];

  const definitions = new Map<string, SchemaDefinition>();

  for (const definition of generated) {
    if (definitions.has(definition.type)) {
      conflicts.push({
        type: definition.type,
        code: "duplicate-type",
        message: `Duplicate generated schema type: ${definition.type}`,
      });

      continue;
    }

    definitions.set(definition.type, definition);
  }

  // Only generated definitions may be overridden, and only when explicitly
  // enabled. A custom definition can never silently replace another custom
  // definition, even when allowGeneratedOverrides is true.
  for (const definition of custom) {
    const existing = definitions.get(definition.type);

    if (existing) {
      const canOverrideGenerated =
        options.allowGeneratedOverrides === true &&
        existing.source === "generated";

      if (!canOverrideGenerated) {
        conflicts.push({
          type: definition.type,
          code: "duplicate-type",
          message:
            existing.source === "generated"
              ? `Custom schema type conflicts with generated type: ${definition.type}`
              : `Duplicate custom schema type: ${definition.type}`,
        });

        continue;
      }
    }

    definitions.set(definition.type, definition);
  }

  // Validate the effective definitions before applying extensions. This also
  // catches duplicates in definitions that would otherwise be collapsed by
  // the extension merge operation.
  deduplicateProperties(definitions.values(), conflicts);

  for (const extension of options.extensions ?? []) {
    const type = normalizeType(extension.type);
    const existing = definitions.get(type);

    if (!existing) {
      conflicts.push({
        type,
        code: "unknown-parent",
        message: `Cannot extend unknown schema type: ${type}`,
      });

      continue;
    }

    if (
      extension.namespace &&
      existing.namespace &&
      extension.namespace !== existing.namespace
    ) {
      conflicts.push({
        type,
        code: "namespace-mismatch",
        message: `Extension namespace does not match ${type}.`,
      });

      continue;
    }

    const properties = new Map<string, SchemaPropertyDefinition>();

    for (const property of existing.properties ?? []) {
      properties.set(property.name, property);
    }

    const extensionPropertyNames = new Set<string>();

    for (const property of extension.properties) {
      if (
        properties.has(property.name) ||
        extensionPropertyNames.has(property.name)
      ) {
        conflicts.push({
          type,
          property: property.name,
          code: "duplicate-property",
          message: `Property ${property.name} already exists on ${type}.`,
        });

        continue;
      }

      extensionPropertyNames.add(property.name);
      properties.set(property.name, normalizeProperty(property));
    }

    definitions.set(type, {
      ...existing,
      properties: [...properties.values()],
    });
  }

  // Report parent references that cannot be resolved by this registry.
  // RDF/RDFS meta-classes (e.g. DataType → rdfs:Class) are vocabulary
  // structure, not Schema.org types, so they are never registered.
  for (const definition of definitions.values()) {
    for (const parentType of definition.parentTypes ?? []) {
      if (definitions.has(parentType) || isRdfVocabularyType(parentType)) {
        continue;
      }

      conflicts.push({
        type: definition.type,
        code: "unknown-parent",
        message: `Unknown parent type ${parentType} referenced by ${definition.type}.`,
      });
    }
  }

  // Freeze every effective definition after all extensions have been applied.
  // This includes nested property metadata, enumeration values and arrays.
  for (const definition of definitions.values()) {
    deepFreeze(definition);
  }

  // Keep the generated/custom collections immutable as well. They contain
  // normalized copies, not references to the caller's original definitions.
  const frozenGenerated = deepFreeze(generated);
  const frozenCustom = deepFreeze(custom);

  const collection = deepFreeze({
    generated: frozenGenerated,
    custom: frozenCustom,
  });

  const frozenConflicts = deepFreeze(conflicts);

  const get = (type: string) => definitions.get(normalizeType(type));

  const getAncestors = (
    type: string,
    visited = new Set<string>(),
  ): SchemaDefinition[] => {
    const definition = get(type);

    if (!definition) {
      return [];
    }

    const result: SchemaDefinition[] = [];

    for (const parentType of definition.parentTypes ?? []) {
      if (visited.has(parentType)) {
        continue;
      }

      visited.add(parentType);

      const parent = get(parentType);

      if (!parent) {
        continue;
      }

      result.push(parent);
      result.push(...getAncestors(parentType, visited));
    }

    return result;
  };

  const getProperties = (
    type: string,
    inherited = true,
  ): readonly SchemaPropertyDefinition[] => {
    const definition = get(type);

    if (!definition) {
      return [];
    }

    const properties = new Map<string, SchemaPropertyDefinition>();

    if (inherited) {
      for (const ancestor of [...getAncestors(type)].reverse()) {
        for (const property of ancestor.properties ?? []) {
          properties.set(property.name, property);
        }
      }
    }

    for (const property of definition.properties ?? []) {
      properties.set(property.name, property);
    }

    return [...properties.values()];
  };

  const isTypeOf = (type: string, expectedType: string): boolean => {
    const normalizedType = normalizeType(type);
    const normalizedExpected = normalizeType(expectedType);

    return (
      normalizedType === normalizedExpected ||
      getAncestors(normalizedType).some(
        (ancestor) => ancestor.type === normalizedExpected,
      )
    );
  };

  return Object.freeze({
    get,
    has: (type: string) => Boolean(get(type)),
    getAll: () => [...definitions.values()],

    getProperty: (type: string, property: string) =>
      getProperties(type).find((item) => item.name === property),

    getProperties: (type: string, options?: { inherited?: boolean }) =>
      getProperties(type, options?.inherited ?? true),

    getAncestors,

    isTypeOf,

    getCollection: () => collection,

    getConflicts: () => frozenConflicts,
  });
};
