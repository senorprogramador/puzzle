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
  sitemapLoader: ReactRouterSeoLoader;
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
