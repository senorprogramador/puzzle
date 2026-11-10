import {
  createAuthRouteHandlers,
  type AuthRouteHandlerMap,
  type AuthServer,
} from "../server";

export type TanStackAuthIntegrationOptions = {
  readonly auth: AuthServer;
  readonly basePath?: string;
};

export const createTanStackAuthRouteHandlers = (
  options: TanStackAuthIntegrationOptions,
): AuthRouteHandlerMap =>
  createAuthRouteHandlers(options.auth, options.basePath);
