import type { SeoConfig } from "../context/types";
import type { SeoGraph, SeoNode } from "../core/types";
import type { SeoPageMetadata } from "../metadata/types";
import type { SeoValidationReport } from "../validation/types";

export interface SeoTestFixture {
  config: SeoConfig;
  nodes?: SeoNode[];
  graph?: SeoGraph;
  metadata?: SeoPageMetadata;
}

export interface SeoTestResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  report: SeoValidationReport;
}

export interface SeoTestOptions {
  strict?: boolean;
  validateSchema?: boolean;
  validateMetadata?: boolean;
  validateReferences?: boolean;
}

export interface SeoGraphNodeInspection {
  id?: string;
  types: string[];
  properties: string[];
}

export interface SeoGraphInspection {
  nodeCount: number;
  typeCounts: Record<string, number>;
  nodes: SeoGraphNodeInspection[];
  references: string[];
  unresolvedReferences: string[];
  valid: boolean;
}

export interface SeoDiagnosticFormatOptions {
  includeSuggestions?: boolean;
  includePaths?: boolean;
  includeSummary?: boolean;
}
