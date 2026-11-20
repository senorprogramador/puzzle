import { reportLocalizedRoute, resolveHeadersLocale } from "./request";

import type {
  HeaderReader,
  RequestLocaleOptions,
} from "./request";
import type { LocaleResolution } from "../locale";

export interface NextRequestLocaleOptions extends RequestLocaleOptions {
  headers: HeaderReader;
  pathname?: string;
}

export const resolveNextRequestLocale = (
  options: NextRequestLocaleOptions,
): LocaleResolution => {
  const resolution = resolveHeadersLocale(options.headers, options);

  if (options.pathname) {
    reportLocalizedRoute(options.pathname, options);
  }

  return resolution;
};
