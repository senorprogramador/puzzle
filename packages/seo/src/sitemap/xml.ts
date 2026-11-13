import type {
  SitemapEntry,
  SitemapImage,
  SitemapVideo,
  SitemapAlternate,
  SitemapValidationIssue,
} from "./types";

import { normalizeSeoUrl } from "../urls";

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const IMAGE_NS = "http://www.google.com/schemas/sitemap-image/1.1";
const VIDEO_NS = "http://www.google.com/schemas/sitemap-video/1.1";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

export const escapeXml = (value: string): string =>
  value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return character;
    }
  });

export const formatSitemapDate = (value: Date | string): string => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid sitemap date: "${value}".`);
  }

  return date.toISOString();
};

const tag = (name: string, value: string): string =>
  `<${name}>${escapeXml(value)}</${name}>`;

const serializeImage = (image: SitemapImage): string => {
  const elements = [tag("image:loc", image.url)];

  if (image.title) {
    elements.push(tag("image:title", image.title));
  }

  if (image.caption) {
    elements.push(tag("image:caption", image.caption));
  }

  return `<image:image>${elements.join("")}</image:image>`;
};

const serializeVideo = (video: SitemapVideo): string => {
  const elements = [
    tag("video:thumbnail_loc", video.thumbnailUrl),
    tag("video:title", video.title),
    tag("video:description", video.description),
  ];

  if (video.contentUrl) {
    elements.push(tag("video:content_loc", video.contentUrl));
  }

  if (video.playerUrl) {
    elements.push(tag("video:player_loc", video.playerUrl));
  }

  if (video.duration !== undefined) {
    elements.push(tag("video:duration", String(video.duration)));
  }

  if (video.expirationDate) {
    elements.push(
      tag("video:expiration_date", formatSitemapDate(video.expirationDate)),
    );
  }

  if (video.rating !== undefined) {
    elements.push(tag("video:rating", String(video.rating)));
  }

  if (video.viewCount !== undefined) {
    elements.push(tag("video:view_count", String(video.viewCount)));
  }

  if (video.publicationDate) {
    elements.push(
      tag("video:publication_date", formatSitemapDate(video.publicationDate)),
    );
  }

  if (video.familyFriendly !== undefined) {
    elements.push(
      tag("video:family_friendly", video.familyFriendly ? "yes" : "no"),
    );
  }

  if (video.restriction) {
    elements.push(
      `<video:restriction relationship="${video.restriction.relationship}">${escapeXml(
        video.restriction.countries.join(" "),
      )}</video:restriction>`,
    );
  }

  if (video.requiresSubscription !== undefined) {
    elements.push(
      tag(
        "video:requires_subscription",
        video.requiresSubscription ? "yes" : "no",
      ),
    );
  }

  if (video.live !== undefined) {
    elements.push(tag("video:live", video.live ? "yes" : "no"));
  }

  if (video.category) {
    elements.push(tag("video:category", video.category));
  }

  for (const item of video.tags ?? []) {
    elements.push(tag("video:tag", item));
  }

  return `<video:video>${elements.join("")}</video:video>`;
};

const serializeAlternate = (alternate: SitemapAlternate): string =>
  `<xhtml:link rel="alternate" hreflang="${escapeXml(
    alternate.locale,
  )}" href="${escapeXml(alternate.url)}" />`;

export interface SerializeSitemapOptions {
  baseUrl: string;
  includeLastModified?: boolean;
  allowExternalUrls?: boolean;
}

export const serializeSitemapEntry = (
  entry: SitemapEntry,
  options: SerializeSitemapOptions,
): string => {
  const url = normalizeSeoUrl(entry.url, {
    baseUrl: options.baseUrl,
    allowExternal: options.allowExternalUrls ?? false,
  });

  const elements = [tag("loc", url)];

  if (options.includeLastModified !== false && entry.lastModified) {
    elements.push(tag("lastmod", formatSitemapDate(entry.lastModified)));
  }

  if (entry.changeFrequency) {
    elements.push(tag("changefreq", entry.changeFrequency));
  }

  if (entry.priority !== undefined) {
    elements.push(tag("priority", entry.priority.toFixed(1)));
  }

  for (const alternate of entry.alternates ?? []) {
    elements.push(
      serializeAlternate({
        ...alternate,
        url: normalizeSeoUrl(alternate.url, {
          baseUrl: options.baseUrl,
          allowExternal: options.allowExternalUrls ?? false,
        }),
      }),
    );
  }

  for (const image of entry.images ?? []) {
    elements.push(
      serializeImage({
        ...image,
        url: normalizeSeoUrl(image.url, {
          baseUrl: options.baseUrl,
          allowExternal: true,
        }),
      }),
    );
  }

  for (const video of entry.videos ?? []) {
    elements.push(serializeVideo(video));
  }

  return `<url>${elements.join("")}</url>`;
};

export const createSitemapXml = (
  entries: readonly SitemapEntry[],
  options: SerializeSitemapOptions,
): string => {
  const hasImages = entries.some((entry) => entry.images?.length);
  const hasVideos = entries.some((entry) => entry.videos?.length);
  const hasAlternates = entries.some((entry) => entry.alternates?.length);

  const namespaces = [
    `xmlns="${SITEMAP_NS}"`,
    ...(hasImages ? [`xmlns:image="${IMAGE_NS}"`] : []),
    ...(hasVideos ? [`xmlns:video="${VIDEO_NS}"`] : []),
    ...(hasAlternates ? [`xmlns:xhtml="${XHTML_NS}"`] : []),
  ];

  const content = entries
    .map((entry) => serializeSitemapEntry(entry, options))
    .join("");

  return [
    XML_HEADER,
    `<urlset ${namespaces.join(" ")}>`,
    content,
    "</urlset>",
  ].join("");
};

export const sitemapByteLength = (value: string): number =>
  new TextEncoder().encode(value).byteLength;

export const validateSitemapEntries = (
  entries: readonly SitemapEntry[],
  options: {
    baseUrl: string;
    allowExternalUrls?: boolean;
    validateAlternates?: boolean;
  },
): SitemapValidationIssue[] => {
  const issues: SitemapValidationIssue[] = [];
  const urls = new Map<string, SitemapEntry>();

  for (const entry of entries) {
    let url: string;

    try {
      url = normalizeSeoUrl(entry.url, {
        baseUrl: options.baseUrl,
        allowExternal: options.allowExternalUrls ?? false,
      });
    } catch (error) {
      issues.push({
        code: "INVALID_URL",
        message: error instanceof Error ? error.message : "Invalid URL.",
        url: String(entry.url),
      });

      continue;
    }

    if (urls.has(url)) {
      issues.push({
        code: "DUPLICATE_URL",
        message: `Duplicate sitemap URL: ${url}.`,
        url,
      });
    } else {
      urls.set(url, entry);
    }

    if (
      entry.priority !== undefined &&
      (!Number.isFinite(entry.priority) ||
        entry.priority < 0 ||
        entry.priority > 1)
    ) {
      issues.push({
        code: "INVALID_PRIORITY",
        message: "Sitemap priority must be between 0 and 1.",
        url,
      });
    }

    if (entry.statusCode !== undefined && entry.statusCode !== 200) {
      issues.push({
        code: "NON_SUCCESS_STATUS",
        message: "Only HTTP 200 pages belong in a sitemap.",
        url,
      });
    }

    for (const video of entry.videos ?? []) {
      if (!video.title.trim() || !video.description.trim()) {
        issues.push({
          code: "INVALID_VIDEO",
          message: "Video title and description are required.",
          url,
        });
      }

      if (
        video.duration !== undefined &&
        (!Number.isInteger(video.duration) || video.duration < 0)
      ) {
        issues.push({
          code: "INVALID_VIDEO_DURATION",
          message: "Video duration must be a non-negative integer.",
          url,
        });
      }

      if (
        video.rating !== undefined &&
        (!Number.isFinite(video.rating) || video.rating < 0 || video.rating > 5)
      ) {
        issues.push({
          code: "INVALID_VIDEO_RATING",
          message: "Video rating must be between 0 and 5.",
          url,
        });
      }
    }

    if (
      entry.changeFrequency &&
      ![
        "always",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "never",
      ].includes(entry.changeFrequency)
    ) {
      issues.push({
        code: "INVALID_CHANGE_FREQUENCY",
        message: "Invalid sitemap change frequency.",
        url,
      });
    }

    if (options.validateAlternates) {
      const locales = new Set<string>();

      for (const alternate of entry.alternates ?? []) {
        if (locales.has(alternate.locale)) {
          issues.push({
            code: "DUPLICATE_HREFLANG",
            message: `Duplicate hreflang locale: ${alternate.locale}.`,
            url,
          });
        }

        locales.add(alternate.locale);

        if (!alternate.locale.trim()) {
          issues.push({
            code: "INVALID_HREFLANG",
            message: "Hreflang locale must not be empty.",
            url,
          });
        }
      }
    }
  }

  if (options.validateAlternates) {
    for (const [url, entry] of urls) {
      for (const alternate of entry.alternates ?? []) {
        let alternateUrl: string;

        try {
          alternateUrl = normalizeSeoUrl(alternate.url, {
            baseUrl: options.baseUrl,
            allowExternal: options.allowExternalUrls ?? false,
          });
        } catch {
          continue;
        }

        const target = urls.get(alternateUrl);

        if (!target) {
          issues.push({
            code: "MISSING_HREFLANG_TARGET",
            message: `Hreflang target is not present in the sitemap: ${alternateUrl}.`,
            url,
          });

          continue;
        }

        const reciprocal = target.alternates?.some(
          (item) =>
            normalizeSeoUrl(item.url, {
              baseUrl: options.baseUrl,
              allowExternal: options.allowExternalUrls ?? false,
            }) === url,
        );

        if (!reciprocal) {
          issues.push({
            code: "NON_RECIPROCAL_HREFLANG",
            message: `Hreflang relationship with ${alternateUrl} is not reciprocal.`,
            url,
          });
        }
      }
    }
  }

  return issues;
};
