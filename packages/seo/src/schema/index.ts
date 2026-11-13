export type {
  SchemaDefinitionSource,
  SchemaPropertyType,
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

export {
  SCHEMAORG_VERSION,
  SCHEMAORG_SOURCE_HASH,
  generatedSchemaDefinitions,
} from "./generated";
