import { createSeoRouteHandlers } from "../server";

import type { SeoRouteOptions, SeoHttpHandler } from "../server";

export interface NextSeoRoutes {
  sitemapGET: SeoHttpHandler;
  robotsGET: SeoHttpHandler;
}

export const createNextSeoRoutes = (
  options: SeoRouteOptions,
): NextSeoRoutes => {
  const handlers = createSeoRouteHandlers(options);

  return {
    sitemapGET: handlers.sitemap,
    robotsGET: handlers.robots,
  };
};
