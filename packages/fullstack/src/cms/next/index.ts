import {
  type CmsRouteHandlerMap,
  type CmsServer,
} from "../server";

export type NextCmsIntegrationOptions = {
  readonly cms: CmsServer;
};

export type NextCmsRouteHandler = (request: Request) => Promise<Response>;

export type NextCmsHandlerSet = {
  readonly GET: NextCmsRouteHandler;
  readonly POST: NextCmsRouteHandler;
  readonly PATCH: NextCmsRouteHandler;
  readonly DELETE: NextCmsRouteHandler;
};

export const createNextCmsRouteHandlers = (
  options: NextCmsIntegrationOptions,
): CmsRouteHandlerMap => options.cms.routes;

export const createNextCmsHandler = (
  options: NextCmsIntegrationOptions,
): NextCmsHandlerSet => {
  const dispatch: NextCmsRouteHandler = (request) =>
    options.cms.dispatch(request);

  return {
    GET: dispatch,
    POST: dispatch,
    PATCH: dispatch,
    DELETE: dispatch,
  };
};
