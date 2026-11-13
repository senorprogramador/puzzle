import type { SeoLocale, SeoUrl } from "../core/types";

import { resolveSeoUrl } from "../context/config";

import type { SeoResolvedConfig } from "../context/types";

import type { ResolvedSeoMetadata, SeoPageMetadata } from "./types";

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
    throw new Error(
      "SEO title is missing. Provide a page title or a default title.",
    );
  }

  if (!pageTitle || !config.title?.template) {
    return title;
  }

  return config.title.template.replace("%s", pageTitle);
};

export const resolveSeoMetadata = (
  metadata: SeoPageMetadata = {},
  config: SeoResolvedConfig,
): ResolvedSeoMetadata => {
  const title = resolveTitle(metadata.title, config);

  const canonical = resolveSeoUrl(
    metadata.canonical ?? config.defaults?.canonical ?? config.siteUrl,
    config,
  );

  const description =
    metadata.description ??
    config.defaults?.description ??
    config.identity?.description;

  const locale = config.defaultLocale as SeoLocale;

  return {
    ...metadata,
    title,
    canonical: canonical as SeoUrl,
    locale,
    description,
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

  if (metadata.robots.noarchive) directives.push("noarchive");
  if (metadata.robots.nosnippet) directives.push("nosnippet");

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
