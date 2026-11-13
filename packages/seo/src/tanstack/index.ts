import { createSeoRouteHandlers } from "../server";

import type { SeoRouteOptions } from "../server";

export interface TanStackServerRouteContext {
  request: Request;
}

export type TanStackSeoRouteHandler = (
  context: TanStackServerRouteContext,
) => Promise<Response>;

export interface TanStackSeoRoutes {
  /**
   * Mount on a dynamic root route, e.g. /$seoFile.
   *
   * Handles the sitemap index and every generated sitemap file.
   */
  sitemapGET: TanStackSeoRouteHandler;

  /**
   * Mount on the static /robots.txt route.
   */
  robotsGET: TanStackSeoRouteHandler;
}

export const createTanStackSeoRoutes = (
  options: SeoRouteOptions,
): TanStackSeoRoutes => {
  const handlers = createSeoRouteHandlers(options);

  return {
    sitemapGET: ({ request }) => handlers.sitemap(request),
    robotsGET: ({ request }) => handlers.robots(request),
  };
};
