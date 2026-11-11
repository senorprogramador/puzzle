import {
  createAuthRouteHandlers,
  type AuthRouteHandlerMap,
  type AuthServer,
} from "../server";

export type NextAuthIntegrationOptions = {
  readonly auth: AuthServer;
  readonly basePath?: string;
};

export type NextAuthRouteHandler = (request: Request) => Promise<Response>;

export type NextAuthHandlerSet = {
  readonly GET: NextAuthRouteHandler;
  readonly POST: NextAuthRouteHandler;
};

const createDispatcher =
  (routes: AuthRouteHandlerMap): NextAuthRouteHandler =>
  async (request) => {
    const pathname = new URL(request.url).pathname;
    const method = request.method.toUpperCase();

    const route = routes[pathname];

    if (!route) {
      return new Response(null, {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    if (method !== "GET" && method !== "POST") {
      return new Response(null, {
        status: 405,
        headers: {
          Allow: Object.keys(route).join(", "),
          "Cache-Control": "no-store",
        },
      });
    }

    const handler = route[method];

    if (!handler) {
      return new Response(null, {
        status: 405,
        headers: {
          Allow: Object.keys(route).join(", "),
          "Cache-Control": "no-store",
        },
      });
    }

    return handler(request);
  };

export const createNextAuthRouteHandlers = (
  options: NextAuthIntegrationOptions,
): AuthRouteHandlerMap =>
  createAuthRouteHandlers(options.auth, options.basePath);

export const createNextAuthHandler = (
  options: NextAuthIntegrationOptions,
): NextAuthHandlerSet => {
  const dispatch = createDispatcher(createNextAuthRouteHandlers(options));

  return {
    GET: dispatch,
    POST: dispatch,
  };
};
