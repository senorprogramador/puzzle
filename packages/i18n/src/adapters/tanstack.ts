import { resolveRequestLocale } from "./request";

import type { RequestLocaleOptions } from "./request";
import type { LocaleResolution } from "../locale";

export interface TanStackLocaleLoaderArgs {
  request: Request;
  params?: Readonly<Record<string, string | undefined>>;
}

export interface TanStackLocaleLoaderOptions extends RequestLocaleOptions {
  localeParam?: string;
}

export const createTanStackLocaleLoader = (
  options: TanStackLocaleLoaderOptions,
): ((args: TanStackLocaleLoaderArgs) => LocaleResolution) => {
  const localeParam = options.localeParam ?? "locale";

  return ({ request, params }) =>
    resolveRequestLocale(request, {
      ...options,
      urlLocale: params?.[localeParam] ?? options.urlLocale,
    });
};
