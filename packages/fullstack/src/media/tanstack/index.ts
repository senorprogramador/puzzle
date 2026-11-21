import {
  type MediaRouteHandlerMap,
  type MediaServer,
} from "../server";

export type TanStackMediaIntegrationOptions = {
  readonly media: MediaServer;
};

export const createTanStackMediaRouteHandlers = (
  options: TanStackMediaIntegrationOptions,
): MediaRouteHandlerMap => options.media.routes;

export const createTanStackMediaHandler = (
  options: TanStackMediaIntegrationOptions,
) => (request: Request): Promise<Response> => options.media.dispatch(request);
