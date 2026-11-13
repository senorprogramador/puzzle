import { generateSitemap } from "../sitemap";
import { generateRobotsTxt } from "../robots";

import type {
  SeoTextResponse,
  SeoSitemapHandlerOptions,
  SeoRobotsHandlerOptions,
} from "./types";

const DEFAULT_CACHE_CONTROL = "public, max-age=3600, s-maxage=3600";

const createTextResponse = (
  body: string,
  options: {
    contentType: string;
    cacheControl?: string;
    headers?: Record<string, string>;
    status?: number;
  },
): SeoTextResponse => ({
  status: options.status ?? 200,
  headers: {
    "Content-Type": options.contentType,
    "Cache-Control": options.cacheControl ?? DEFAULT_CACHE_CONTROL,
    "X-Content-Type-Options": "nosniff",
    ...options.headers,
  },
  body,
});

export const createSitemapHandler = (options: SeoSitemapHandlerOptions) => {
  return (): SeoTextResponse => {
    try {
      const result = generateSitemap(options.sitemap);

      if (result.issues.length > 0) {
        return createTextResponse(
          result.issues.map((issue) => issue.message).join("\n"),
          {
            contentType: "text/plain; charset=utf-8",
            status: 500,
            cacheControl: "no-store",
          },
        );
      }

      const body =
        result.indexXml ??
        result.files[0]?.xml ??
        [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
        ].join("");

      return createTextResponse(body, {
        contentType: "application/xml; charset=utf-8",
        cacheControl: options.cacheControl,
      });
    } catch (error) {
      return createTextResponse(
        error instanceof Error ? error.message : "Sitemap generation failed.",
        {
          contentType: "text/plain; charset=utf-8",
          status: 500,
          cacheControl: "no-store",
        },
      );
    }
  };
};

export const createRobotsHandler = (options: SeoRobotsHandlerOptions) => {
  return (): SeoTextResponse => {
    const result = generateRobotsTxt(options.robots);

    if (result.issues.length > 0) {
      return createTextResponse(
        result.issues.map((issue) => issue.message).join("\n"),
        {
          contentType: "text/plain; charset=utf-8",
          status: 500,
          cacheControl: "no-store",
        },
      );
    }

    return createTextResponse(result.content, {
      contentType: "text/plain; charset=utf-8",
      cacheControl: options.cacheControl,
    });
  };
};
