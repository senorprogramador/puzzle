import type {
  SitemapEntry,
  SitemapOptions,
  SitemapGenerationOptions,
  SitemapResult,
  SitemapCollection,
  SitemapFile,
} from "./types";

import { normalizeSeoUrl, normalizeSeoOrigin } from "../urls";

import {
  createSitemapXml,
  sitemapByteLength,
  validateSitemapEntries,
} from "./xml";

const DEFAULT_MAX_ENTRIES = 50_000;
const DEFAULT_MAX_BYTES = 50 * 1024 * 1024;

const normalizeEntries = (
  entries: readonly SitemapEntry[],
  baseUrl: string,
  allowExternalUrls: boolean,
): SitemapEntry[] => {
  const unique = new Map<string, SitemapEntry>();

  for (const entry of entries) {
    if (
      entry.indexable === false ||
      (entry.statusCode !== undefined && entry.statusCode !== 200) ||
      entry.redirectTo
    ) {
      continue;
    }

    try {
      const url = normalizeSeoUrl(entry.url, {
        baseUrl,
        allowExternal: allowExternalUrls,
      });

      if (unique.has(url)) {
        continue;
      }

      const alternates = (entry.alternates ?? []).flatMap((alternate) => {
        try {
          return [
            {
              ...alternate,
              url: normalizeSeoUrl(alternate.url, {
                baseUrl,
                allowExternal: allowExternalUrls,
              }),
            },
          ];
        } catch {
          return [];
        }
      });

      const images = (entry.images ?? []).flatMap((image) => {
        try {
          return [
            {
              ...image,
              url: normalizeSeoUrl(image.url, {
                baseUrl,
                allowExternal: true,
              }),
            },
          ];
        } catch {
          return [];
        }
      });

      unique.set(url, {
        ...entry,
        url,
        alternates,
        images,
      });
    } catch {
      // Invalid URLs are reported by validateSitemapEntries.
    }
  }

  return [...unique.values()].sort((a, b) =>
    String(a.url).localeCompare(String(b.url)),
  );
};

export const serializeSitemap = (options: SitemapOptions): SitemapResult => {
  const baseUrl = normalizeSeoOrigin(options.baseUrl);

  const issues = validateSitemapEntries(options.entries, {
    baseUrl,
    allowExternalUrls: options.allowExternalUrls,
  });

  const entries = normalizeEntries(
    options.entries,
    baseUrl,
    options.allowExternalUrls ?? false,
  );

  return {
    xml: createSitemapXml(entries, {
      baseUrl,
      includeLastModified: options.includeLastModified,
      allowExternalUrls: options.allowExternalUrls,
    }),
    entries,
    issues,
  };
};

const createSitemapIndexXml = (files: readonly SitemapFile[]): string => {
  const content = files
    .map((file) => `<sitemap><loc>${file.url}</loc></sitemap>`)
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    content,
    "</sitemapindex>",
  ].join("");
};

export const generateSitemap = (
  options: SitemapGenerationOptions,
): SitemapCollection => {
  const baseUrl = normalizeSeoOrigin(options.baseUrl);

  const maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;

  if (
    !Number.isInteger(maxEntries) ||
    maxEntries < 1 ||
    maxEntries > DEFAULT_MAX_ENTRIES
  ) {
    throw new Error("Sitemap maxEntries must be between 1 and 50,000.");
  }

  if (
    !Number.isInteger(maxBytes) ||
    maxBytes < 1024 ||
    maxBytes > DEFAULT_MAX_BYTES
  ) {
    throw new Error("Sitemap maxBytes must be between 1 KB and 50 MB.");
  }

  const issues = validateSitemapEntries(options.entries, {
    baseUrl,
    allowExternalUrls: options.allowExternalUrls,
    validateAlternates: options.validateAlternates,
  });

  const entries = normalizeEntries(
    options.entries,
    baseUrl,
    options.allowExternalUrls ?? false,
  );

  const files: SitemapFile[] = [];

  let current: SitemapEntry[] = [];

  const createXml = (items: readonly SitemapEntry[]) =>
    createSitemapXml(items, {
      baseUrl,
      includeLastModified: options.includeLastModified,
      allowExternalUrls: options.allowExternalUrls,
    });

  const flush = () => {
    if (current.length === 0) {
      return;
    }

    const number = files.length + 1;

    const filename = `${options.filename ?? "sitemap"}-${number}.xml`;

    const url = normalizeSeoUrl(`/${filename}`, {
      baseUrl,
      allowExternal: false,
    });

    files.push({
      filename,
      url,
      xml: createXml(current),
      entries: current,
    });

    current = [];
  };

  for (const entry of entries) {
    const singleXml = createXml([entry]);

    if (sitemapByteLength(singleXml) > maxBytes) {
      issues.push({
        code: "ENTRY_TOO_LARGE",
        message: `Sitemap entry exceeds the configured byte limit: ${entry.url}.`,
        url: String(entry.url),
      });

      continue;
    }

    const candidate = [...current, entry];

    const exceedsCount = candidate.length > maxEntries;
    const exceedsBytes = sitemapByteLength(createXml(candidate)) > maxBytes;

    if (current.length > 0 && (exceedsCount || exceedsBytes)) {
      flush();
    }

    current.push(entry);
  }

  flush();

  if (files.length > DEFAULT_MAX_ENTRIES) {
    throw new Error(
      "Sitemap index exceeds the maximum of 50,000 sitemap references.",
    );
  }

  const indexXml = files.length > 1 ? createSitemapIndexXml(files) : undefined;

  const indexUrl = indexXml
    ? normalizeSeoUrl(`/${options.filename ?? "sitemap"}.xml`, { baseUrl })
    : undefined;

  return {
    files,
    indexXml,
    indexUrl,
    totalEntries: files.reduce((total, file) => total + file.entries.length, 0),
    issues,
  };
};
