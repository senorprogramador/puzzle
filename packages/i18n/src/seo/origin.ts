import type { LocaleRegistry } from "../locale";

export const resolveSeoOrigin = (value: string): URL => {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid multilingual SEO base URL: "${value}".`);
  }

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Multilingual SEO base URLs must be HTTP(S) origins without credentials, path, query, or hash.",
    );
  }

  return url;
};

export const resolveSeoOrigins = (
  registry: LocaleRegistry,
  baseUrl: string,
  baseUrls: Readonly<Record<string, string>> = {},
): ReadonlyMap<string, URL> => {
  const origins = new Map<string, URL>();
  const defaultOrigin = resolveSeoOrigin(baseUrl);

  for (const [inputLocale, value] of Object.entries(baseUrls)) {
    const locale = registry.resolve(inputLocale);

    if (!locale) {
      throw new Error(`Unsupported SEO origin locale "${inputLocale}".`);
    }

    if (origins.has(locale)) {
      throw new Error(`More than one SEO origin resolves to "${locale}".`);
    }

    origins.set(locale, resolveSeoOrigin(value));
  }

  for (const definition of registry.locales) {
    if (!origins.has(definition.locale)) {
      origins.set(definition.locale, defaultOrigin);
    }
  }

  return origins;
};
