import { createSeoRouteHandlers } from "../server";

import type { SeoRouteOptions } from "../server";

export interface ReactRouterLoaderArgs {
  request: Request;
  params: Record<string, string | undefined>;
  context: unknown;
}

export type ReactRouterSeoLoader = (
  args: ReactRouterLoaderArgs,
) => Promise<Response>;

export interface ReactRouterSeoRoutes {
  /**
   * Mount on a dynamic root resource route, e.g. /:seoFile.
   *
   * Handles the sitemap index and every generated sitemap file.
   */
  sitemapLoader: ReactRouterSeoLoader;

  /**
   * Mount on the static /robots.txt resource route.
   */
  robotsLoader: ReactRouterSeoLoader;
}

export const createReactRouterSeoRoutes = (
  options: SeoRouteOptions,
): ReactRouterSeoRoutes => {
  const handlers = createSeoRouteHandlers(options);

  return {
    sitemapLoader: ({ request }) => handlers.sitemap(request),
    robotsLoader: ({ request }) => handlers.robots(request),
  };
};
