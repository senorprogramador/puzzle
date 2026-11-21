import {
  type CmsRouteHandlerMap,
  type CmsServer,
} from "../server";

export type TanStackCmsIntegrationOptions = {
  readonly cms: CmsServer;
};

export const createTanStackCmsRouteHandlers = (
  options: TanStackCmsIntegrationOptions,
): CmsRouteHandlerMap => options.cms.routes;

export const createTanStackCmsHandler = (
  options: TanStackCmsIntegrationOptions,
) => (request: Request): Promise<Response> => options.cms.dispatch(request);
