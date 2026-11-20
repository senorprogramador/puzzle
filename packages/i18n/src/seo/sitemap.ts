import { generateSitemap } from "@puzzle-ui/seo/sitemap";

import type {
  SitemapCollection,
  SitemapEntry,
  SitemapGenerationOptions,
} from "@puzzle-ui/seo/sitemap";
import type { LocaleRegistry } from "../locale";
import { createLocalizedRouting } from "../routing";
import { resolveSeoOrigin, resolveSeoOrigins } from "./origin";

export interface LocalizedSitemapPage {
  path: string;
  localizedPaths?: Readonly<Record<string, string>>;
  entry?: Omit<SitemapEntry, "url" | "alternates">;
}

export interface GenerateLocalizedSitemapOptions
  extends Omit<SitemapGenerationOptions, "entries"> {
  registry: LocaleRegistry;
  pages: readonly LocalizedSitemapPage[];
  baseUrls?: Readonly<Record<string, string>>;
  prefixDefaultLocale?: boolean;
  basePath?: string;
}

const applyBasePath = (path: string, basePath: string | undefined): string => {
  if (!basePath) {
    return path;
  }

  const normalized = basePath.replace(/\/+$/, "");

  if (path === normalized || path.startsWith(`${normalized}/`)) {
    return path;
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  return `${normalized}${path === "/" ? "" : path}` || "/";
};

export const createLocalizedSitemapEntries = (
  options: Pick<
    GenerateLocalizedSitemapOptions,
    | "registry"
    | "baseUrl"
    | "baseUrls"
    | "pages"
    | "prefixDefaultLocale"
    | "basePath"
  >,
): SitemapEntry[] => {
  const routing = createLocalizedRouting({
    registry: options.registry,
    prefixDefaultLocale: options.prefixDefaultLocale,
    basePath: options.basePath,
  });
  resolveSeoOrigin(String(options.baseUrl));
  const origins = resolveSeoOrigins(
    options.registry,
    String(options.baseUrl),
    options.baseUrls,
  );
  const entries: SitemapEntry[] = [];

  for (const page of options.pages) {
    const localeUrls = new Map<string, string>();

    for (const inputLocale of Object.keys(page.localizedPaths ?? {})) {
      if (!options.registry.resolve(inputLocale)) {
        throw new Error(
          `Localized sitemap path uses unsupported locale "${inputLocale}".`,
        );
      }
    }

    for (const definition of options.registry.locales) {
      const matchingPaths = Object.entries(page.localizedPaths ?? {}).filter(
        ([inputLocale]) =>
          options.registry.resolve(inputLocale) === definition.locale,
      );

      if (matchingPaths.length > 1) {
        throw new Error(
          `More than one localized sitemap path resolves to "${definition.locale}".`,
        );
      }

      const path = applyBasePath(
        matchingPaths[0]?.[1] ?? page.path,
        options.basePath,
      );
      const match = routing.match(path);
      const origin = origins.get(definition.locale);

      if (!origin) {
        throw new Error(
          `No sitemap origin is configured for "${definition.locale}".`,
        );
      }

      if (match.search || match.hash) {
        throw new Error(
          `Localized sitemap path "${path}" must not contain a query or fragment.`,
        );
      }

      localeUrls.set(
        definition.locale,
        new URL(routing.localize(path, definition.locale), origin).href,
      );
    }

    const alternates = options.registry.locales.map((definition) => {
      const url = localeUrls.get(definition.locale);

      if (!url) {
        throw new Error(
          `Could not create sitemap alternate for "${definition.locale}".`,
        );
      }

      return { locale: definition.locale, url };
    });

    for (const definition of options.registry.locales) {
      const url = localeUrls.get(definition.locale);

      if (!url) {
        throw new Error(
          `Could not create sitemap entry for "${definition.locale}".`,
        );
      }

      entries.push({
        ...page.entry,
        url,
        alternates,
      });
    }
  }

  return entries;
};

export const generateLocalizedSitemap = (
  options: GenerateLocalizedSitemapOptions,
): SitemapCollection => {
  const {
    registry,
    pages,
    baseUrls,
    prefixDefaultLocale,
    basePath,
    ...sitemapOptions
  } = options;
  const baseUrl = resolveSeoOrigin(String(sitemapOptions.baseUrl));
  const origins = resolveSeoOrigins(
    registry,
    String(sitemapOptions.baseUrl),
    baseUrls,
  );
  const hasExternalOrigin = [...origins.values()].some(
    (origin) => origin.origin !== baseUrl.origin,
  );

  if (hasExternalOrigin && !sitemapOptions.allowExternalUrls) {
    throw new Error(
      "Localized sitemap origins differ from baseUrl; set allowExternalUrls to true to include cross-origin locales.",
    );
  }

  return generateSitemap({
    ...sitemapOptions,
    entries: createLocalizedSitemapEntries({
      registry,
      baseUrl: sitemapOptions.baseUrl,
      baseUrls,
      pages,
      prefixDefaultLocale,
      basePath,
    }),
  });
};
