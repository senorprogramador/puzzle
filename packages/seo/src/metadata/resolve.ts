import type { SeoLocale, SeoUrl } from "../core/types";

import { resolveSeoUrl } from "../context/config";

import type { SeoResolvedConfig } from "../context/types";

import type {
  ResolvedSeoMetadata,
  SeoAlternateLanguage,
  SeoPageMetadata,
} from "./types";

const normalizeLocale = (locale: string): SeoLocale => {
  try {
    const normalized = Intl.getCanonicalLocales(locale)[0];

    if (!normalized) {
      throw new Error();
    }

    return normalized as SeoLocale;
  } catch {
    throw new Error(`Invalid SEO page locale: "${locale}".`);
  }
};

const resolvePageLocale = (
  locale: string | undefined,
  config: SeoResolvedConfig,
): SeoLocale => {
  const resolved = normalizeLocale(locale ?? config.defaultLocale);

  if (!config.supportedLocales.includes(resolved)) {
    throw new Error(
      `Unsupported SEO page locale "${resolved}". ` +
        `Supported locales: ${config.supportedLocales.join(", ")}.`,
    );
  }

  return resolved;
};

const resolveTitle = (
  pageTitle: string | undefined,
  config: SeoResolvedConfig,
): string => {
  const fallback =
    config.defaults?.title ??
    config.title?.default ??
    config.identity?.name ??
    "";

  const title = pageTitle ?? fallback;

  if (!title) {
    return "";
  }

  if (!pageTitle || !config.title?.template) {
    return title;
  }

  return config.title.template.replace("%s", pageTitle);
};

const resolveAlternates = (
  alternates: SeoAlternateLanguage[] | undefined,
  config: SeoResolvedConfig,
): SeoAlternateLanguage[] | undefined => {
  if (!alternates?.length) {
    return undefined;
  }

  const seenLocales = new Set<string>();

  return alternates.map((alternate) => {
    const locale =
      alternate.locale === "x-default"
        ? "x-default"
        : normalizeLocale(alternate.locale);

    if (
      locale !== "x-default" &&
      !config.supportedLocales.includes(locale as SeoLocale)
    ) {
      throw new Error(
        `Unsupported hreflang locale "${locale}". ` +
          `Supported locales: ${config.supportedLocales.join(", ")}.`,
      );
    }

    if (seenLocales.has(locale)) {
      throw new Error(`Duplicate hreflang locale "${locale}".`);
    }

    seenLocales.add(locale);

    return {
      locale,
      url: resolveSeoUrl(alternate.url, config),
    };
  });
};

export const resolveSeoMetadata = (
  metadata: SeoPageMetadata = {},
  config: SeoResolvedConfig,
): ResolvedSeoMetadata => {
  const locale = resolvePageLocale(metadata.locale, config);
  const title = resolveTitle(metadata.title, config);

  const canonical = resolveSeoUrl(
    metadata.canonical ?? config.defaults?.canonical ?? config.siteUrl,
    config,
  );

  const description =
    metadata.description ??
    config.defaults?.description ??
    config.identity?.description;

  const alternates = resolveAlternates(metadata.alternates?.alternates, config);

  return {
    ...metadata,
    title,
    canonical: canonical as SeoUrl,
    locale,
    description,
    alternates: alternates ? { alternates } : undefined,
    openGraph: {
      ...metadata.openGraph,
      title: metadata.openGraph?.title ?? title,
      description: metadata.openGraph?.description ?? description,
      type: metadata.openGraph?.type ?? "website",
      url: metadata.openGraph?.url ?? canonical,
      siteName: metadata.openGraph?.siteName ?? config.identity?.name,
      locale: metadata.openGraph?.locale ?? locale.replace("-", "_"),
    },
    twitter: {
      ...metadata.twitter,
      card: metadata.twitter?.card ?? "summary_large_image",
      title: metadata.twitter?.title ?? title,
      description: metadata.twitter?.description ?? description,
      images:
        metadata.twitter?.images ??
        metadata.openGraph?.images?.map((image) => image.url),
    },
  };
};

export const resolveSeoRobots = (
  metadata: SeoPageMetadata,
  config: SeoResolvedConfig,
): string | undefined => {
  if (!metadata.robots) {
    return config.defaults?.robots;
  }

  const directives = [
    metadata.robots.index === false ? "noindex" : "index",
    metadata.robots.follow === false ? "nofollow" : "follow",
  ];

  if (metadata.robots.noarchive) {
    directives.push("noarchive");
  }

  if (metadata.robots.nosnippet) {
    directives.push("nosnippet");
  }

  if (metadata.robots.maxSnippet !== undefined) {
    directives.push(`max-snippet:${metadata.robots.maxSnippet}`);
  }

  if (metadata.robots.maxImagePreview) {
    directives.push(`max-image-preview:${metadata.robots.maxImagePreview}`);
  }

  if (metadata.robots.maxVideoPreview !== undefined) {
    directives.push(`max-video-preview:${metadata.robots.maxVideoPreview}`);
  }

  return directives.join(", ");
};
