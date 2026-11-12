import type { SeoConfig } from "../context/types";

import type { SeoGraph } from "../core/types";

import type { SeoPageMetadata } from "../metadata/types";

export interface SeoRequestContext {
  requestId?: string;

  url: string;

  locale?: string;

  config: SeoConfig;
}

export interface SeoServerResult {
  metadata?: SeoPageMetadata;

  graph?: SeoGraph;
}

export interface SeoServerAdapter {
  resolve(context: SeoRequestContext): Promise<SeoServerResult>;
}
