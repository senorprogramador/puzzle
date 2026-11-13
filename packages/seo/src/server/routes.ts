import { createRobotsHandler, createSitemapHandler } from "./handlers";

import type {
  SeoRouteHandlers,
  SeoRouteOptions,
  SeoTextResponse,
} from "./types";

const toResponse = (result: SeoTextResponse): Response =>
  new Response(result.body, {
    status: result.status,
    headers: result.headers,
  });

export const createSeoRouteHandlers = (
  options: SeoRouteOptions,
): SeoRouteHandlers => {
  const sitemapHandler = createSitemapHandler(options.sitemap);
  const robotsHandler = createRobotsHandler(options.robots);

  return {
    sitemap: async (request) => toResponse(await sitemapHandler(request)),

    robots: async (request) => toResponse(await robotsHandler(request)),
  };
};
