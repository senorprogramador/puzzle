export type {
  SchemaDefinitionSource,
  SchemaPropertyType,
  SchemaEnumerationValue,
  SchemaPropertyDefinition,
  SchemaDefinition,
  SchemaExtension,
  SchemaReference,
  SchemaRegistryProvider,
  SchemaRegistry,
  SchemaRegistryOptions,
  SchemaRegistryConflict,
  SchemaValidationOptions,
  SchemaDefinitionCollection,
} from "./types";

export { createSchemaRegistry } from "./registry";
export { createDefaultSchemaRegistry } from "./create-registry";
export { validateSchemaNode } from "./validate";

export {
  SCHEMAORG_VERSION,
  SCHEMAORG_SOURCE_HASH,
  generatedSchemaDefinitions,
} from "./generated";
