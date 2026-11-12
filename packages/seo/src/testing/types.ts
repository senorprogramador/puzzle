import type { SeoConfig } from "../context/types";

import type { SeoGraph, SeoNode } from "../core/types";

export interface SeoTestFixture {
  config: SeoConfig;

  nodes?: SeoNode[];

  graph?: SeoGraph;
}

export interface SeoTestResult {
  passed: boolean;

  errors: string[];

  warnings: string[];
}

export interface SeoTestOptions {
  strict?: boolean;

  validateSchema?: boolean;

  validateMetadata?: boolean;

  validateReferences?: boolean;
}
