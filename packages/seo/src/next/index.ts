import { createSeoRouteHandlers } from "../server";

import type { SeoRouteOptions, SeoHttpHandler } from "../server";

export interface NextSeoRoutes {
  /**
   * Mount on a dynamic root route, e.g. app/[seoFile]/route.ts.
   *
   * Handles the sitemap index and every generated sitemap file.
   */
  sitemapGET: SeoHttpHandler;

  /**
   * Mount on the static robots route, e.g. app/robots.txt/route.ts.
   */
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
