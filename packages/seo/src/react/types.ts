import type { ReactNode } from "react";

import type {
  SeoGraph,
  SeoGraphBuilderOptions,
  SeoNode,
  SeoValidationIssue,
} from "../core/types";

import type { SeoConfig } from "../context/types";

import type { SeoPageMetadata } from "../metadata/types";

import type { SchemaRegistry, SchemaValidationOptions } from "../schema/types";

import type { SchemaOrgPropertyNames } from "../schema/generated";

/**
 * Only definitions belonging to the Schema.org namespace are exposed
 * as strongly typed React schema components.
 */
export type SchemaComponentType = keyof SchemaOrgPropertyNames;

export type SchemaValue =
  | string
  | number
  | boolean
  | null
  | Date
  | SeoNode
  | { "@id": string }
  | readonly SchemaValue[]
  | { readonly [property: string]: SchemaValue };

/**
 * Properties available on a Schema.org type.
 *
 * The default is Thing, which provides the common base properties.
 * Use a concrete type for type-specific component properties.
 */
export type SchemaProperties<Type extends SchemaComponentType = "Thing"> = {
  [Property in SchemaOrgPropertyNames[Type]]?: SchemaValue;
};

export type SchemaComponentProps<Type extends SchemaComponentType = "Thing"> =
  SchemaProperties<Type> & {
    /**
     * Explicit Schema.org @id.
     *
     * Overrides the automatically generated identifier.
     */
    id?: string;

    /**
     * Additional Schema.org properties.
     *
     * Use this for properties not represented by the generated definitions.
     */
    data?: Readonly<Record<string, SchemaValue>>;
  };

export interface SchemaProps {
  type: string;
  id?: string;

  /**
   * Schema.org properties.
   */
  data?: Readonly<Record<string, SchemaValue>>;

  /**
   * Additional properties, merged with data.
   * Explicit properties take precedence.
   */
  properties?: Readonly<Record<string, SchemaValue>>;
}

export interface SchemaReferenceProps {
  /**
   * Absolute, relative or fragment identifier of the referenced entity.
   */
  id: string;

  /**
   * Optional Schema.org type of the referenced entity.
   *
   * Defaults to Thing when omitted.
   */
  type?: SchemaComponentType;
}

export type SchemaGraphProps =
  | {
      nodes: readonly SeoNode[];
      graph?: never;
    }
  | {
      graph: SeoGraph;
      nodes?: never;
    };

export interface SeoProviderProps {
  config: SeoConfig;

  children: ReactNode;

  /**
   * JSON-LD script element ID.
   */
  scriptId?: string;

  /**
   * CSP nonce applied to the central JSON-LD script.
   */
  nonce?: string;

  /**
   * Graph builder configuration.
   *
   * The baseUrl defaults to config.siteUrl.
   */
  graphOptions?: SeoGraphBuilderOptions;

  /**
   * Custom schema registry.
   *
   * Defaults to the generated Schema.org registry.
   */
  schemaRegistry?: SchemaRegistry;

  /**
   * Schema validation.
   *
   * Set to false to disable registry validation.
   * Strict mode rejects unknown types and properties.
   */
  validation?: SchemaValidationOptions | false;
}

export interface SeoContextValue {
  config: SeoConfig;

  metadata?: SeoPageMetadata;

  registerNode: (node: SeoNode) => void;
}

export interface SeoMetadataProps {
  metadata: SeoPageMetadata;
}

export interface SeoJsonLdProps {
  data: SeoNode | SeoGraph | readonly SeoNode[];

  /**
   * Explicit Schema.org @id for a single node.
   */
  id?: string;

  /**
   * Optional CSP nonce.
   *
   * The actual script is rendered centrally by SeoProvider.
   */
  nonce?: string;
}

export interface SeoHeadProps {
  children?: ReactNode;
}

export interface SeoSchemaValidationError {
  nodeId?: string;
  issues: readonly SeoValidationIssue[];
}
