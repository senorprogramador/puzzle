import {
  createAuthRouteHandlers,
  type AuthRouteHandlerMap,
  type AuthServer,
} from "../server";

export type NextAuthIntegrationOptions = {
  readonly auth: AuthServer;
  readonly basePath?: string;
};

export const createNextAuthRouteHandlers = (
  options: NextAuthIntegrationOptions,
): AuthRouteHandlerMap =>
  createAuthRouteHandlers(options.auth, options.basePath);
