import {
  type MediaRouteHandlerMap,
  type MediaServer,
} from "../server";

export type NextMediaIntegrationOptions = {
  readonly media: MediaServer;
};

export type NextMediaRouteHandler = (request: Request) => Promise<Response>;

export type NextMediaHandlerSet = {
  readonly GET: NextMediaRouteHandler;
  readonly POST: NextMediaRouteHandler;
  readonly PATCH: NextMediaRouteHandler;
  readonly DELETE: NextMediaRouteHandler;
};

export const createNextMediaRouteHandlers = (
  options: NextMediaIntegrationOptions,
): MediaRouteHandlerMap => options.media.routes;

export const createNextMediaHandler = (
  options: NextMediaIntegrationOptions,
): NextMediaHandlerSet => {
  const dispatch: NextMediaRouteHandler = (request) =>
    options.media.dispatch(request);

  return {
    GET: dispatch,
    POST: dispatch,
    PATCH: dispatch,
    DELETE: dispatch,
  };
};
