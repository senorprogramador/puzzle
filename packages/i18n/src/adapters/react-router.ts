import { resolveRequestLocale } from "./request";

import type { RequestLocaleOptions } from "./request";
import type { LocaleResolution } from "../locale";

export interface ReactRouterLocaleLoaderArgs {
  request: Request;
  params: Readonly<Record<string, string | undefined>>;
}

export interface ReactRouterLocaleLoaderOptions extends RequestLocaleOptions {
  localeParam?: string;
}

export const createReactRouterLocaleLoader = (
  options: ReactRouterLocaleLoaderOptions,
): ((args: ReactRouterLocaleLoaderArgs) => LocaleResolution) => {
  const localeParam = options.localeParam ?? "locale";

  return ({ request, params }) =>
    resolveRequestLocale(request, {
      ...options,
      urlLocale: params[localeParam] ?? options.urlLocale,
    });
};
