import { createLocalizedRouting } from "../routing";
import { resolveLocale } from "../locale";

import type { LocalizedRouteMap } from "../routing";
import type { I18nRuntimeEvent } from "../runtime";
import type { LocaleRegistry, LocaleResolution } from "../locale";

export interface HeaderReader {
  get(name: string): string | null;
}

export interface RequestLocaleOptions {
  registry: LocaleRegistry;
  cookieName?: string;
  urlLocale?: string;
  basePath?: string;
  routes?: LocalizedRouteMap;
  onRoute?: (event: Extract<I18nRuntimeEvent, { type: "route" }>) => void;
}

const validateCookieName = (cookieName: string): void => {
  if (!cookieName || /[;=\s]/.test(cookieName)) {
    throw new Error(`Invalid locale cookie name "${cookieName}".`);
  }
};

const readCookie = (
  cookieHeader: string | null,
  cookieName: string,
): string | undefined => {
  if (!cookieHeader) {
    return undefined;
  }

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");

    if (separator < 0 || part.slice(0, separator).trim() !== cookieName) {
      continue;
    }

    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return undefined;
    }
  }

  return undefined;
};

export const resolveHeadersLocale = (
  headers: HeaderReader,
  options: RequestLocaleOptions,
): LocaleResolution => {
  const cookieName = options.cookieName ?? "puzzle-locale";
  validateCookieName(cookieName);

  return resolveLocale({
    registry: options.registry,
    urlLocale: options.urlLocale,
    cookie: readCookie(headers.get("cookie"), cookieName),
    acceptLanguage: headers.get("accept-language") ?? undefined,
  });
};

export const reportLocalizedRoute = (
  pathname: string,
  options: RequestLocaleOptions,
): void => {
  if (!options.onRoute || !options.routes) {
    return;
  }

  const routing = createLocalizedRouting({
    registry: options.registry,
    basePath: options.basePath,
    routes: options.routes,
  });
  const match = routing.match(pathname);
  const route = routing.matchRoute(pathname);
  const routePath = route
    ? options.routes[route.routeId]?.[route.locale]
    : undefined;
  const pathnameTemplate = typeof routePath === "string"
    ? routePath
    : routePath?.path ?? "<unmatched>";

  options.onRoute(Object.freeze({
    type: "route",
    pathname: pathnameTemplate,
    status: route
      ? route.redirectTo
        ? "redirected"
        : "matched"
      : "unmatched",
    locale: route?.locale ?? match.locale,
    ...(route ? { routeId: route.routeId } : {}),
  }));
};

export const resolveRequestLocale = (
  request: Request,
  options: RequestLocaleOptions,
): LocaleResolution => {
  const routing = createLocalizedRouting({
    registry: options.registry,
    basePath: options.basePath,
    routes: options.routes,
  });
  const pathname = new URL(request.url).pathname;
  const match = routing.match(pathname);
  const resolution = resolveHeadersLocale(request.headers, {
    ...options,
    urlLocale: options.urlLocale ??
      (match.matchedPrefix ? match.locale : undefined),
  });

  reportLocalizedRoute(pathname, options);

  return resolution;
};
