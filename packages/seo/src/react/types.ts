import type { ReactNode } from "react";

import type {
  SeoGraph,
  SeoGraphBuilderOptions,
  SeoNode,
  SeoValidationIssue,
} from "../core/types";

import type { SeoConfig, SeoResolvedConfig } from "../context/types";

import type { SeoPageMetadata, ResolvedSeoMetadata } from "../metadata/types";

import type { SchemaRegistry, SchemaValidationOptions } from "../schema/types";

import type { SchemaOrgPropertyNames } from "../schema/generated";
import type {
  SeoValidationOptions,
  SeoValidationReport,
} from "../validation/types";

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

export type SchemaProperties<Type extends SchemaComponentType = "Thing"> = {
  [Property in SchemaOrgPropertyNames[Type]]?: SchemaValue;
};

export type SchemaComponentProps<Type extends SchemaComponentType = "Thing"> =
  SchemaProperties<Type> & {
    id?: string;
    data?: Readonly<Record<string, SchemaValue>>;
  };

export interface SchemaProps {
  type: string;
  id?: string;
  data?: Readonly<Record<string, SchemaValue>>;
  properties?: Readonly<Record<string, SchemaValue>>;
}

export interface SchemaReferenceProps {
  id: string;
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
  metadata?: SeoPageMetadata;
  scriptId?: string;
  nonce?: string;
  graphOptions?: SeoGraphBuilderOptions;
  schemaRegistry?: SchemaRegistry;

  /**
   * Controls validation of the complete SEO output.
   *
   * false disables validation.
   *
   * Legacy SchemaValidationOptions are still supported.
   */
  validation?: SeoValidationOptions | SchemaValidationOptions | false;

  /**
   * Receives validation diagnostics after rendering.
   *
   * In warn mode the JSON-LD output is still rendered.
   * In strict mode invalid output throws before rendering.
   */
  onValidation?: (report: SeoValidationReport) => void;
}

export interface SeoContextValue {
  config: SeoResolvedConfig;
  metadata?: ResolvedSeoMetadata;
  registerNode: (node: SeoNode) => void;
}

export interface SeoMetadataProps {
  metadata: SeoPageMetadata;
  children?: ReactNode;
}

export interface SeoJsonLdProps {
  data: SeoNode | SeoGraph | readonly SeoNode[];
  id?: string;
  nonce?: string;
}

export interface SeoHeadProps {
  children?: ReactNode;
}

export interface SeoSchemaValidationError {
  nodeId?: string;
  issues: readonly SeoValidationIssue[];
}
