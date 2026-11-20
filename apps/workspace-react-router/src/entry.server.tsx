import { createElement } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";

import { getStaticMetadata, routes } from "./routes";

export interface RenderedDocument {
  status: number;
  html: string;
}

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);

export const renderRequest = async (
  request: Request,
): Promise<Response | RenderedDocument> => {
  const handler = createStaticHandler(routes);
  const result = await handler.query(request);

  if (result instanceof Response) return result;

  const router = createStaticRouter(handler.dataRoutes, result);
  const app = renderToString(
    createElement(StaticRouterProvider, {
      router,
      context: result,
    }),
  );
  const metadata = getStaticMetadata(result.matches, result.loaderData);
  const pathname = new URL(request.url).pathname;

  return {
    status: result.statusCode,
    html: `<!doctype html><html lang="${escapeHtml(metadata.locale)}" dir="${metadata.direction}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(metadata.title)}</title><meta name="description" content="${escapeHtml(metadata.description)}"><meta property="og:title" content="${escapeHtml(metadata.title)}"><meta property="og:description" content="${escapeHtml(metadata.description)}"><link rel="canonical" href="${escapeHtml(new URL(pathname, request.url).href)}"><script type="module" src="${escapeHtml(process.env.CLIENT_ENTRY ?? "/src/entry.client.tsx")}"></script></head><body><div id="root">${app}</div></body></html>`,
  };
};
