import type { SeoLocale, SeoUrl } from "../core/types";

import { resolveSeoUrl } from "../context/config";

import type { SeoResolvedConfig } from "../context/types";

import type {
  ResolvedSeoMetadata,
  SeoAlternateLanguage,
  SeoPageMetadata,
  SeoRobotsMetadata,
  SeoSocialImage,
} from "./types";

// ---------------------------------------------------------------------------
// Locale
// ---------------------------------------------------------------------------

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

// A regional variant (nl-NL) is supported when its base language (nl) is.
const isSupportedLocale = (
  locale: SeoLocale,
  config: SeoResolvedConfig,
): boolean =>
  config.supportedLocales.includes(locale) ||
  config.supportedLocales.includes(locale.split("-")[0] as SeoLocale);

const resolvePageLocale = (
  locale: string | undefined,
  config: SeoResolvedConfig,
): SeoLocale => {
  const resolved = normalizeLocale(locale ?? config.defaultLocale);

  if (!isSupportedLocale(resolved, config)) {
    throw new Error(
      `Unsupported SEO page locale "${resolved}". ` +
        `Supported locales: ${config.supportedLocales.join(", ")}.`,
    );
  }

  return resolved;
};

// ---------------------------------------------------------------------------
// URL
// ---------------------------------------------------------------------------

const resolveSafeUrl = (value: string, config: SeoResolvedConfig): SeoUrl => {
  const resolved = resolveSeoUrl(value, config);

  const url = new URL(resolved);

  if (url.username || url.password) {
    throw new Error(`SEO URLs must not contain credentials: "${value}".`);
  }

  return resolved;
};

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------

const resolveTitle = (
  pageTitle: string | undefined,
  config: SeoResolvedConfig,
): string => {
  const fallback =
    config.metadata?.title ??
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

// ---------------------------------------------------------------------------
// Description
// ---------------------------------------------------------------------------

const resolveDescription = (
  pageDescription: string | undefined,
  config: SeoResolvedConfig,
): string | undefined =>
  pageDescription ??
  config.metadata?.description ??
  config.defaults?.description ??
  config.identity?.description;

// ---------------------------------------------------------------------------
// Social images
// ---------------------------------------------------------------------------

const resolveSocialImage = (
  image: SeoSocialImage,
  config: SeoResolvedConfig,
): SeoSocialImage => {
  if (
    image.width !== undefined &&
    (!Number.isInteger(image.width) || image.width <= 0)
  ) {
    throw new Error("SEO social image width must be a positive integer.");
  }

  if (
    image.height !== undefined &&
    (!Number.isInteger(image.height) || image.height <= 0)
  ) {
    throw new Error("SEO social image height must be a positive integer.");
  }

  return {
    ...image,
    url: resolveSafeUrl(image.url, config),
  };
};

// ---------------------------------------------------------------------------
// Hreflang
// ---------------------------------------------------------------------------

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
      !isSupportedLocale(locale as SeoLocale, config)
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
      url: resolveSafeUrl(alternate.url, config),
    };
  });
};

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const resolveSeoMetadata = (
  metadata: SeoPageMetadata = {},
  config: SeoResolvedConfig,
): ResolvedSeoMetadata => {
  const locale = resolvePageLocale(metadata.locale, config);

  const title = resolveTitle(metadata.title, config);

  const description = resolveDescription(metadata.description, config);

  const canonicalValue =
    metadata.canonical ??
    config.metadata?.canonical ??
    config.defaults?.canonical;

  const canonical = canonicalValue
    ? resolveSafeUrl(canonicalValue, config)
    : undefined;

  const alternates = resolveAlternates(metadata.alternates?.alternates, config);

  const openGraphImages = metadata.openGraph?.images?.map((image) =>
    resolveSocialImage(image, config),
  );

  const openGraph = {
    ...metadata.openGraph,

    title: metadata.openGraph?.title ?? title,

    description: metadata.openGraph?.description ?? description,

    type: metadata.openGraph?.type ?? "website",

    // og:url is required by Open Graph; fall back to the site root when no page URL is known.
    url: metadata.openGraph?.url
      ? resolveSafeUrl(metadata.openGraph.url, config)
      : (canonical ?? resolveSafeUrl(config.siteUrl, config)),

    siteName: metadata.openGraph?.siteName ?? config.identity?.name,

    locale: metadata.openGraph?.locale ?? locale.replace("-", "_"),

    images: openGraphImages,
  };

  const twitterImages = metadata.twitter?.images
    ? metadata.twitter.images.map((image) => resolveSafeUrl(image, config))
    : openGraphImages?.map((image) => image.url);

  const twitter = {
    ...metadata.twitter,

    card: metadata.twitter?.card ?? ("summary_large_image" as const),

    title: metadata.twitter?.title ?? title,

    description: metadata.twitter?.description ?? description,

    images: twitterImages,

    imageAlt: metadata.twitter?.imageAlt ?? openGraphImages?.[0]?.alt,
  };

  return {
    ...metadata,

    title,
    description,
    canonical,
    locale,

    alternates: alternates ? { alternates } : undefined,

    openGraph,
    twitter,
  };
};

// ---------------------------------------------------------------------------
// Robots
// ---------------------------------------------------------------------------

const validatePreviewValue = (name: string, value: number): void => {
  if (!Number.isInteger(value) || value < -1) {
    throw new Error(
      `SEO robots ${name} must be an integer greater than or equal to -1.`,
    );
  }
};

const resolveRobotsDirectives = (robots: SeoRobotsMetadata): string => {
  const directives = [
    robots.index === false ? "noindex" : "index",
    robots.follow === false ? "nofollow" : "follow",
  ];

  if (robots.noarchive) {
    directives.push("noarchive");
  }

  if (robots.nosnippet) {
    directives.push("nosnippet");
  }

  if (robots.maxSnippet !== undefined) {
    validatePreviewValue("maxSnippet", robots.maxSnippet);

    directives.push(`max-snippet:${robots.maxSnippet}`);
  }

  if (
    robots.maxImagePreview !== undefined &&
    !["none", "standard", "large"].includes(robots.maxImagePreview)
  ) {
    throw new Error(
      `Invalid SEO robots maxImagePreview: "${robots.maxImagePreview}".`,
    );
  }

  if (robots.maxImagePreview) {
    directives.push(`max-image-preview:${robots.maxImagePreview}`);
  }

  if (robots.maxVideoPreview !== undefined) {
    validatePreviewValue("maxVideoPreview", robots.maxVideoPreview);

    directives.push(`max-video-preview:${robots.maxVideoPreview}`);
  }

  return directives.join(", ");
};

export const resolveSeoRobots = (
  metadata: SeoPageMetadata,
  config: SeoResolvedConfig,
): string | undefined => {
  if (metadata.robots) {
    return resolveRobotsDirectives(metadata.robots);
  }

  return config.metadata?.robots ?? config.defaults?.robots;
};
