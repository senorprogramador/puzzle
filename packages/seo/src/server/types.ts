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

export interface SeoTextResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface SeoTextHandlerOptions {
  contentType: string;
  cacheControl?: string;
  headers?: Record<string, string>;
  status?: number;
}

export interface SeoTextHandler {
  (): SeoTextResponse | Promise<SeoTextResponse>;
}

export interface SeoSitemapHandlerOptions {
  sitemap: import("../sitemap/types").SitemapGenerationOptions;
  cacheControl?: string;
}

export interface SeoRobotsHandlerOptions {
  robots: import("../robots/types").RobotsOptions;
  cacheControl?: string;
}
