import { generateSitemap } from "../sitemap";
import { generateRobotsTxt } from "../robots";

import type {
  SeoTextResponse,
  SeoSitemapHandlerOptions,
  SeoRobotsHandlerOptions,
} from "./types";

const DEFAULT_CACHE_CONTROL = "public, max-age=3600, s-maxage=3600";

const XML_CONTENT_TYPE = "application/xml; charset=utf-8";
const TEXT_CONTENT_TYPE = "text/plain; charset=utf-8";

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

const createNotFoundResponse = (): SeoTextResponse =>
  createTextResponse("Not found.", {
    contentType: TEXT_CONTENT_TYPE,
    status: 404,
    cacheControl: "no-store",
  });

const createErrorResponse = (
  error: unknown,
  fallback: string,
): SeoTextResponse =>
  createTextResponse(error instanceof Error ? error.message : fallback, {
    contentType: TEXT_CONTENT_TYPE,
    status: 500,
    cacheControl: "no-store",
  });

const getRequestPathname = (request?: Request): string | undefined => {
  if (!request) {
    return undefined;
  }

  try {
    return new URL(request.url).pathname;
  } catch {
    return "";
  }
};

const normalizeRoutePath = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  return normalized.replace(/\/+/g, "/");
};

const getSitemapIndexPath = (options: SeoSitemapHandlerOptions): string => {
  if (options.path) {
    return normalizeRoutePath(options.path);
  }

  return normalizeRoutePath(`/${options.sitemap.filename ?? "sitemap"}.xml`);
};

const getSitemapFilePath = (filename: string): string =>
  normalizeRoutePath(`/${filename}`);

export const createSitemapHandler = (options: SeoSitemapHandlerOptions) => {
  return (request?: Request): SeoTextResponse => {
    try {
      const result = generateSitemap(options.sitemap);

      if (result.issues.length > 0) {
        return createTextResponse(
          result.issues.map((issue) => issue.message).join("\n"),
          {
            contentType: TEXT_CONTENT_TYPE,
            status: 500,
            cacheControl: "no-store",
          },
        );
      }

      const requestedPath = getRequestPathname(request);
      const indexPath = getSitemapIndexPath(options);

      if (requestedPath && requestedPath !== indexPath) {
        const requestedFile = result.files.find(
          (file) => getSitemapFilePath(file.filename) === requestedPath,
        );

        if (!requestedFile) {
          return createNotFoundResponse();
        }

        return createTextResponse(requestedFile.xml, {
          contentType: XML_CONTENT_TYPE,
          cacheControl: options.cacheControl,
        });
      }

      const body =
        result.indexXml ??
        result.files[0]?.xml ??
        [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
        ].join("");

      return createTextResponse(body, {
        contentType: XML_CONTENT_TYPE,
        cacheControl: options.cacheControl,
      });
    } catch (error) {
      return createErrorResponse(error, "Sitemap generation failed.");
    }
  };
};

export const createRobotsHandler = (options: SeoRobotsHandlerOptions) => {
  return (request?: Request): SeoTextResponse => {
    const requestedPath = getRequestPathname(request);
    const robotsPath = normalizeRoutePath(options.path ?? "/robots.txt");

    if (requestedPath && requestedPath !== robotsPath) {
      return createNotFoundResponse();
    }

    try {
      const result = generateRobotsTxt(options.robots);

      if (result.issues.length > 0) {
        return createTextResponse(
          result.issues.map((issue) => issue.message).join("\n"),
          {
            contentType: TEXT_CONTENT_TYPE,
            status: 500,
            cacheControl: "no-store",
          },
        );
      }

      return createTextResponse(result.content, {
        contentType: TEXT_CONTENT_TYPE,
        cacheControl: options.cacheControl,
      });
    } catch (error) {
      return createErrorResponse(error, "Robots.txt generation failed.");
    }
  };
};
