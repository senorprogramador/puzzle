import {
  createAuthRouteHandlers,
  type AuthRouteHandlerMap,
  type AuthServer,
} from "../server";

export type TanStackAuthIntegrationOptions = {
  readonly auth: AuthServer;
  readonly basePath?: string;
};

const createDispatcher =
  (routes: AuthRouteHandlerMap) =>
  async (request: Request): Promise<Response> => {
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

export const createTanStackAuthRouteHandlers = (
  options: TanStackAuthIntegrationOptions,
): AuthRouteHandlerMap =>
  createAuthRouteHandlers(options.auth, options.basePath);

export const createTanStackAuthHandler = (
  options: TanStackAuthIntegrationOptions,
) => createDispatcher(createTanStackAuthRouteHandlers(options));
