import type {
  SeoGraph,
  SeoNode,
  SeoValidationIssue as SeoCoreValidationIssue,
} from "../core/types";

import type { ResolvedSeoMetadata, SeoPageMetadata } from "../metadata/types";

import type { SchemaRegistry } from "../schema/types";

export type SeoValidationMode = "off" | "warn" | "strict";

export type SeoValidationSource =
  | "graph"
  | "schema"
  | "semantic"
  | "metadata"
  | "rich-results"
  | "registry"
  | "custom";

export type SeoRichResultProfile =
  | "article"
  | "product"
  | "breadcrumb"
  | "event"
  | "recipe"
  | "job-posting"
  | "local-business"
  | "software-application";

// Extends the core issue so validation reports stay assignable to graph issue APIs.
export interface SeoValidationIssue extends SeoCoreValidationIssue {
  source: SeoValidationSource;
  suggestion?: string;
  docsUrl?: string;
}

export interface SeoValidationSummary {
  errors: number;
  warnings: number;
  infos: number;
  total: number;
}

export interface SeoValidationReport {
  valid: boolean;
  mode: SeoValidationMode;
  issues: SeoValidationIssue[];
  summary: SeoValidationSummary;
}

export interface SeoValidationContext {
  graph?: SeoGraph;
  metadata?: SeoPageMetadata | ResolvedSeoMetadata;
  registry: SchemaRegistry;
  mode: SeoValidationMode;
}

export type SeoCustomValidator = (
  context: SeoValidationContext,
) => readonly SeoValidationIssue[];

export interface SeoValidationOptions {
  /**
   * off: disable validation.
   * warn: report issues without rejecting output.
   * strict: treat warnings as errors.
   */
  mode?: SeoValidationMode;

  /**
   * Schema.org registry.
   *
   * Defaults to the generated Puzzle registry.
   */
  registry?: SchemaRegistry;

  /**
   * Additional Google Rich Results profiles to validate.
   */
  profiles?: readonly SeoRichResultProfile[];

  /**
   * Custom validation rules.
   */
  validators?: readonly SeoCustomValidator[];

  /**
   * Validate required Schema.org properties.
   */
  validateRequiredProperties?: boolean;

  /**
   * Whether references to external entities are permitted.
   */
  allowExternalReferences?: boolean;

  /**
   * Base URL used for resolving local references.
   */
  baseUrl?: string;
}

export interface SeoValidationInput {
  graph?: SeoGraph;
  nodes?: readonly SeoNode[];
  metadata?: SeoPageMetadata | ResolvedSeoMetadata;
}
