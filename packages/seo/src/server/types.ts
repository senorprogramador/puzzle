import type { SeoConfig } from "../context/types";
import type { SeoGraph } from "../core/types";
import type { SeoPageMetadata } from "../metadata/types";

import type { RobotsOptions } from "../robots/types";
import type { SitemapGenerationOptions } from "../sitemap/types";

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
  (request?: Request): SeoTextResponse | Promise<SeoTextResponse>;
}

export interface SeoSitemapHandlerOptions {
  sitemap: SitemapGenerationOptions;
  cacheControl?: string;

  /**
   * Public URL of the sitemap index.
   *
   * Defaults to /{filename}.xml, where filename defaults to "sitemap".
   */
  path?: string;
}

export interface SeoRobotsHandlerOptions {
  robots: RobotsOptions;
  cacheControl?: string;

  /**
   * Public URL of robots.txt.
   *
   * Defaults to /robots.txt.
   */
  path?: string;
}

export interface SeoRouteOptions {
  sitemap: SeoSitemapHandlerOptions;
  robots: SeoRobotsHandlerOptions;
}

export type SeoHttpHandler = (request: Request) => Promise<Response>;

export interface SeoRouteHandlers {
  sitemap: SeoHttpHandler;
  robots: SeoHttpHandler;
}
