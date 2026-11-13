import type { JsonObject, SeoNode, SeoNodeId } from "../core/types";

export type SchemaDefinitionSource = "generated" | "custom";

export type SchemaPropertyType = string | string[];

export interface SchemaEnumerationValue {
  name: string;
  type: string;
  description?: string;
}

export interface SchemaPropertyDefinition {
  name: string;
  type: SchemaPropertyType;
  required?: boolean;
  multiple?: boolean;
  description?: string;
  expectedTypes?: string[];
  domainTypes?: string[];
  rangeTypes?: string[];
  inverseOf?: string;
  supersededBy?: string;
}

export interface SchemaDefinition<T extends SeoNode = SeoNode> {
  name: string;
  type: string;
  source: SchemaDefinitionSource;
  description?: string;
  properties?: readonly SchemaPropertyDefinition[];
  parentTypes?: readonly string[];
  enumerationValues?: readonly SchemaEnumerationValue[];
  nodeType?: string;
  namespace?: string;
  create?: (input: JsonObject) => T;
}

export interface SchemaExtension {
  type: string;
  namespace?: string;
  properties: readonly SchemaPropertyDefinition[];
  description?: string;
  parentTypes?: readonly string[];
}

export interface SchemaReference {
  id: SeoNodeId | string;
  type?: string;
}

export interface SchemaRegistryProvider {
  get(type: string): SchemaDefinition | undefined;
  has(type: string): boolean;
  getAll(): readonly SchemaDefinition[];
}

export interface SchemaValidationOptions {
  strict?: boolean;
  allowUnknownProperties?: boolean;
  validateRequiredProperties?: boolean;
}

export interface SchemaDefinitionCollection {
  generated: readonly SchemaDefinition[];
  custom: readonly SchemaDefinition[];
}

export interface SchemaRegistryConflict {
  type: string;
  property?: string;
  code:
    | "duplicate-type"
    | "duplicate-property"
    | "unknown-parent"
    | "namespace-mismatch";
  message: string;
}

export interface SchemaRegistryOptions {
  generated?: readonly SchemaDefinition[];
  custom?: readonly SchemaDefinition[];
  extensions?: readonly SchemaExtension[];
  allowGeneratedOverrides?: boolean;
}

export interface SchemaRegistry extends SchemaRegistryProvider {
  getProperty(
    type: string,
    property: string,
  ): SchemaPropertyDefinition | undefined;

  getProperties(
    type: string,
    options?: { inherited?: boolean },
  ): readonly SchemaPropertyDefinition[];

  getAncestors(type: string): readonly SchemaDefinition[];

  isTypeOf(type: string, expectedType: string): boolean;

  getCollection(): SchemaDefinitionCollection;

  getConflicts(): readonly SchemaRegistryConflict[];
}
