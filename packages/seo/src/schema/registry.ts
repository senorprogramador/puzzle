import type {
  SchemaDefinition,
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

  return value.replace(/^http:\/\/schema\.org\//, "https://schema.org/");
};

const normalizeDefinition = (
  definition: SchemaDefinition,
): SchemaDefinition => ({
  ...definition,
  type: normalizeType(definition.type),
  parentTypes: definition.parentTypes?.map(normalizeType),
  properties: definition.properties?.map((property) => ({
    ...property,
    expectedTypes: property.expectedTypes?.map(normalizeType),
    rangeTypes: property.rangeTypes?.map(normalizeType),
    domainTypes: property.domainTypes?.map(normalizeType),
  })),
});

export const createSchemaRegistry = (
  options: SchemaRegistryOptions = {},
): SchemaRegistry => {
  const generated = (options.generated ?? []).map(normalizeDefinition);
  const custom = (options.custom ?? []).map(normalizeDefinition);
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

  for (const definition of custom) {
    const existing = definitions.get(definition.type);

    if (existing) {
      if (!options.allowGeneratedOverrides) {
        conflicts.push({
          type: definition.type,
          code: "duplicate-type",
          message: `Custom schema type conflicts with generated type: ${definition.type}`,
        });

        continue;
      }
    }

    definitions.set(definition.type, definition);
  }

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

    for (const property of extension.properties) {
      if (properties.has(property.name)) {
        conflicts.push({
          type,
          property: property.name,
          code: "duplicate-property",
          message: `Property ${property.name} already exists on ${type}.`,
        });

        continue;
      }

      properties.set(property.name, property);
    }

    definitions.set(type, {
      ...existing,
      properties: [...properties.values()],
    });
  }

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

  return {
    get,
    has: (type) => Boolean(get(type)),
    getAll: () => [...definitions.values()],

    getProperty: (type, property) =>
      getProperties(type).find((item) => item.name === property),

    getProperties: (type, options) =>
      getProperties(type, options?.inherited ?? true),

    getAncestors,

    isTypeOf,

    getCollection: () => ({
      generated,
      custom,
    }),

    getConflicts: () => conflicts,
  };
};
