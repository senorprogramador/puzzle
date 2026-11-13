import type { SeoLocale, SeoUrl } from "../core/types";
import { normalizeSeoPath } from "../urls/normalize";
import type { SeoConfig, SeoResolvedConfig } from "./types";

export { normalizeSeoPath };

const DEFAULT_LOCALE = "en";
const DEFAULT_TRAILING_SLASH = "never";

const normalizeLocale = (locale: string): SeoLocale => {
  if (!locale.trim()) {
    throw new Error("SEO locale must not be empty.");
  }

  try {
    const normalized = Intl.getCanonicalLocales(locale)[0];

    if (!normalized) {
      throw new Error(`Invalid SEO locale: "${locale}".`);
    }

    return normalized as SeoLocale;
  } catch {
    throw new Error(`Invalid SEO locale: "${locale}".`);
  }
};

const normalizeSiteUrl = (value: string): SeoUrl => {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `Invalid SEO siteUrl: "${value}". Expected an absolute HTTP(S) URL.`,
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SEO siteUrl must use HTTP or HTTPS.");
  }

  if (url.username || url.password) {
    throw new Error("SEO siteUrl must not contain credentials.");
  }

  // Paths, queries and fragments are dropped: page URLs resolve against the origin.
  return url.origin as SeoUrl;
};

const normalizeLocales = (
  defaultLocale: string,
  supportedLocales: readonly string[] | undefined,
): {
  defaultLocale: SeoLocale;
  supportedLocales: SeoLocale[];
} => {
  const normalizedDefault = normalizeLocale(defaultLocale);

  const locales = (
    supportedLocales?.length ? supportedLocales : [defaultLocale]
  ).map(normalizeLocale);

  if (!locales.includes(normalizedDefault)) {
    locales.unshift(normalizedDefault);
  }

  return {
    defaultLocale: normalizedDefault,
    supportedLocales: [...new Set(locales)],
  };
};

export const normalizeSeoConfig = (config: SeoConfig): SeoResolvedConfig => {
  if (!config || typeof config !== "object") {
    throw new Error("SeoProvider requires a valid configuration object.");
  }

  if (typeof config.siteUrl !== "string" || !config.siteUrl.trim()) {
    throw new Error("SEO siteUrl is required.");
  }

  const siteUrl = normalizeSiteUrl(config.siteUrl);

  const locales = normalizeLocales(
    config.defaultLocale ?? DEFAULT_LOCALE,
    config.supportedLocales,
  );

  const trailingSlash = config.trailingSlash ?? DEFAULT_TRAILING_SLASH;

  if (!["always", "never", "preserve"].includes(trailingSlash)) {
    throw new Error(`Invalid SEO trailingSlash value: "${trailingSlash}".`);
  }

  if (config.title?.template && !config.title.template.includes("%s")) {
    throw new Error(
      'SEO title.template must contain "%s" as the page-title placeholder.',
    );
  }

  const identityUrl = config.identity?.url
    ? normalizeSiteUrl(config.identity.url)
    : siteUrl;

  return {
    ...config,
    siteUrl,
    ...locales,
    trailingSlash,
    title: {
      separator: " | ",
      ...config.title,
    },
    defaults: {
      ...config.defaults,
    },
    metadata: {
      ...config.metadata,
    },
    identity: config.identity
      ? {
          ...config.identity,
          url: identityUrl,
          sameAs: config.identity.sameAs
            ? [...config.identity.sameAs]
            : undefined,
        }
      : undefined,
  };
};

export const resolveSeoUrl = (
  value: string,
  config: SeoResolvedConfig,
): SeoUrl => {
  let url: URL;

  try {
    url = new URL(value, config.siteUrl);
  } catch {
    throw new Error(`Invalid SEO URL: "${value}".`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`SEO URL must use HTTP or HTTPS: "${value}".`);
  }

  const siteOrigin = new URL(config.siteUrl).origin;

  if (url.origin === siteOrigin) {
    url.pathname = normalizeSeoPath(url.pathname, config.trailingSlash);
  }

  return url.toString() as SeoUrl;
};
