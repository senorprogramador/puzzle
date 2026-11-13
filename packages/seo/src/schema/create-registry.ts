import { generatedSchemaDefinitions } from "./generated";
import { createSchemaRegistry } from "./registry";
import type {
  SchemaDefinition,
  SchemaRegistry,
  SchemaRegistryOptions,
} from "./types";

export const createDefaultSchemaRegistry = (
  options: Omit<SchemaRegistryOptions, "generated"> = {},
): SchemaRegistry => {
  return createSchemaRegistry({
    ...options,
    generated:
      generatedSchemaDefinitions as unknown as readonly SchemaDefinition[],
  });
};
