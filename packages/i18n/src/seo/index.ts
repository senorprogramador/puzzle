import type { LocaleRegistry } from "../locale";
import type { SeoPageMetadata } from "@puzzle-ui/seo/metadata";
import { createLocalizedRouting } from "../routing";
import { resolveSeoOrigins } from "./origin";

export interface LocalizedSeoAlternate {
  locale: string;
  url: string;
}

export type LocalizedSeoMetadata = Pick<
  SeoPageMetadata,
  "locale" | "canonical" | "alternates" | "openGraph" | "twitter"
> & {
  locale: string;
  canonical: string;
  alternates: NonNullable<SeoPageMetadata["alternates"]>;
  openGraph: NonNullable<SeoPageMetadata["openGraph"]>;
};

export interface CreateLocalizedSeoMetadataOptions {
  registry: LocaleRegistry;
  baseUrl: string;
  baseUrls?: Readonly<Record<string, string>>;
  locale: string;
  path: string;
  localizedPaths?: Readonly<Record<string, string>>;
  prefixDefaultLocale?: boolean;
  basePath?: string;
  title?: string;
  description?: string;
  openGraph?: SeoPageMetadata["openGraph"];
  twitter?: SeoPageMetadata["twitter"];
}

export interface LocalizedSeoPageInput {
  id: string;
  path: string;
  localizedPaths?: Readonly<Record<string, string>>;
  canonicalUrls?: Readonly<Record<string, string>>;
  hreflangAlternates?: readonly LocalizedSeoAlternate[];
}

export interface LocalizedSeoValidationIssue {
  code:
    | "invalid-locale"
    | "invalid-path"
    | "missing-locale-path"
    | "locale-prefix-mismatch"
    | "duplicate-canonical"
    | "canonical-mismatch"
    | "invalid-hreflang"
    | "duplicate-hreflang"
    | "missing-hreflang"
    | "hreflang-mismatch";
  page: string;
  locale?: string;
  message: string;
}

export interface ValidateLocalizedSeoOptions {
  registry: LocaleRegistry;
  baseUrl: string;
  baseUrls?: Readonly<Record<string, string>>;
  pages: readonly LocalizedSeoPageInput[];
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

export const createLocalizedSeoMetadata = (
  options: CreateLocalizedSeoMetadataOptions,
): LocalizedSeoMetadata => {
  const locale = options.registry.resolve(options.locale);

  if (!locale) {
    throw new Error(`Unsupported locale "${options.locale}".`);
  }

  const origins = resolveSeoOrigins(
    options.registry,
    options.baseUrl,
    options.baseUrls,
  );
  const originForLocale = (targetLocale: string): URL => {
    const origin = origins.get(targetLocale);

    if (!origin) {
      throw new Error(`No SEO origin is configured for "${targetLocale}".`);
    }

    return origin;
  };
  const routing = createLocalizedRouting({
    registry: options.registry,
    prefixDefaultLocale: options.prefixDefaultLocale,
    basePath: options.basePath,
  });
  const pathForLocale = (targetLocale: string): string => {
    let sourcePath = options.path;
    let hasLocalizedPath = false;

    for (const [inputLocale, localizedPath] of Object.entries(
      options.localizedPaths ?? {},
    )) {
      const resolvedLocale = options.registry.resolve(inputLocale);

      if (!resolvedLocale) {
        throw new Error(`Unsupported localized path locale "${inputLocale}".`);
      }

      if (resolvedLocale === targetLocale) {
        if (hasLocalizedPath) {
          throw new Error(
            `More than one localized path resolves to "${targetLocale}".`,
          );
        }

        hasLocalizedPath = true;
        sourcePath = localizedPath;
      }
    }

    const localizedInput = applyBasePath(sourcePath, options.basePath);
    const match = routing.match(localizedInput);

    if (match.search || match.hash) {
      throw new Error("Localized SEO paths must not contain a query or fragment.");
    }

    return routing.localize(localizedInput, targetLocale);
  };
  const alternates = options.registry.locales.map((definition) => ({
    locale: definition.locale,
    url: new URL(
      pathForLocale(definition.locale),
      originForLocale(definition.locale),
    ).href,
  }));

  const defaultPath = pathForLocale(options.registry.defaultLocale);
  const canonical = new URL(pathForLocale(locale), originForLocale(locale)).href;

  alternates.push({
    locale: "x-default",
    url: new URL(
      defaultPath,
      originForLocale(options.registry.defaultLocale),
    ).href,
  });

  return {
    locale,
    canonical,
    alternates: { alternates },
    openGraph: {
      ...options.openGraph,
      url: canonical,
      locale: locale.replaceAll("-", "_"),
      ...(options.title !== undefined && options.openGraph?.title === undefined
        ? { title: options.title }
        : {}),
      ...(options.description !== undefined &&
          options.openGraph?.description === undefined
        ? { description: options.description }
        : {}),
    },
    ...(options.twitter ? { twitter: { ...options.twitter } } : {}),
  };
};

export const validateLocalizedSeo = (
  options: ValidateLocalizedSeoOptions,
): LocalizedSeoValidationIssue[] => {
  const issues: LocalizedSeoValidationIssue[] = [];
  const seenCanonicalUrls = new Map<string, { page: string; locale: string }>();
  const routing = createLocalizedRouting({
    registry: options.registry,
    prefixDefaultLocale: options.prefixDefaultLocale,
    basePath: options.basePath,
  });

  for (const page of options.pages) {
    for (const inputLocale of [
      ...Object.keys(page.localizedPaths ?? {}),
      ...Object.keys(page.canonicalUrls ?? {}),
    ]) {
      if (!options.registry.resolve(inputLocale)) {
        issues.push({
          code: "invalid-locale",
          page: page.id,
          locale: inputLocale,
          message: `Localized path uses unsupported locale "${inputLocale}".`,
        });
      }
    }

    for (const definition of options.registry.locales) {
      const localizedPath = page.localizedPaths?.[definition.locale];

      if (page.localizedPaths && localizedPath === undefined) {
        issues.push({
          code: "missing-locale-path",
          page: page.id,
          locale: definition.locale,
          message: `Page "${page.id}" has no localized path for "${definition.locale}".`,
        });
        continue;
      }

      const path = localizedPath ?? page.path;

      try {
        const localizedInput = applyBasePath(path, options.basePath);
        const match = routing.match(localizedInput);

        if (match.matchedPrefix && match.locale !== definition.locale) {
          issues.push({
            code: "locale-prefix-mismatch",
            page: page.id,
            locale: definition.locale,
            message: `Path for "${definition.locale}" is prefixed with "${match.locale}".`,
          });
        }

        const metadata = createLocalizedSeoMetadata({
          registry: options.registry,
          baseUrl: options.baseUrl,
          baseUrls: options.baseUrls,
          locale: definition.locale,
          path: localizedInput,
          prefixDefaultLocale: options.prefixDefaultLocale,
          basePath: options.basePath,
        });
        const existing = seenCanonicalUrls.get(metadata.canonical);

        if (existing) {
          issues.push({
            code: "duplicate-canonical",
            page: page.id,
            locale: definition.locale,
            message: `Canonical URL duplicates page "${existing.page}" for "${existing.locale}".`,
          });
        } else {
          seenCanonicalUrls.set(metadata.canonical, {
            page: page.id,
            locale: definition.locale,
          });
        }

        const expectedCanonical = page.canonicalUrls?.[definition.locale];

        if (expectedCanonical && expectedCanonical !== metadata.canonical) {
          issues.push({
            code: "canonical-mismatch",
            page: page.id,
            locale: definition.locale,
            message: `Canonical URL for "${definition.locale}" does not match the localized path.`,
          });
        }

        if (
          page.hreflangAlternates &&
          definition.locale === options.registry.defaultLocale
        ) {
          const seenLocales = new Set<string>();

          for (const alternate of page.hreflangAlternates) {
            const alternateLocale = alternate.locale === "x-default"
              ? "x-default"
              : options.registry.resolve(alternate.locale);

            if (!alternateLocale) {
              issues.push({
                code: "invalid-hreflang",
                page: page.id,
                locale: alternate.locale,
                message: `Hreflang uses unsupported locale "${alternate.locale}".`,
              });
              continue;
            }

            if (seenLocales.has(alternateLocale)) {
              issues.push({
                code: "duplicate-hreflang",
                page: page.id,
                locale: alternateLocale,
                message: `Hreflang locale "${alternateLocale}" is duplicated.`,
              });
              continue;
            }

            seenLocales.add(alternateLocale);
            const expected = alternateLocale === "x-default"
              ? metadata.alternates.alternates.find(
                (item) => item.locale === "x-default",
              )?.url
              : metadata.alternates.alternates.find(
                (item) => item.locale === alternateLocale,
              )?.url;

            if (expected !== alternate.url) {
              issues.push({
                code: "hreflang-mismatch",
                page: page.id,
                locale: alternateLocale,
                message: `Hreflang URL for "${alternateLocale}" does not match the localized canonical URL.`,
              });
            }
          }

          for (const alternate of metadata.alternates.alternates) {
            if (!seenLocales.has(alternate.locale)) {
              issues.push({
                code: "missing-hreflang",
                page: page.id,
                locale: alternate.locale,
                message: `Hreflang locale "${alternate.locale}" is missing.`,
              });
            }
          }
        }
      } catch (error) {
        issues.push({
          code: "invalid-path",
          page: page.id,
          locale: definition.locale,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  return issues;
};

export const withStructuredDataLocale = <
  Data extends Readonly<Record<string, unknown>>,
>(
  data: Data,
  inputLocale: string,
  canonicalUrl?: string,
): Omit<Data, "inLanguage"> & { inLanguage: string } => {
  let locale: string;

  try {
    const [canonical] = Intl.getCanonicalLocales(inputLocale);

    if (!canonical) {
      throw new Error();
    }

    locale = canonical;
  } catch {
    throw new Error(`Invalid structured-data locale "${inputLocale}".`);
  }

  if (
    data.inLanguage !== undefined &&
    data.inLanguage !== locale
  ) {
    throw new Error(
      `Structured data already has a conflicting language "${String(data.inLanguage)}".`,
    );
  }

  if (canonicalUrl !== undefined) {
    let canonical: string;

    try {
      const url = new URL(canonicalUrl);

      if (
        (url.protocol !== "https:" && url.protocol !== "http:") ||
        url.username ||
        url.password ||
        url.search ||
        url.hash
      ) {
        throw new Error();
      }

      canonical = url.href;
    } catch {
      throw new Error(`Invalid structured-data canonical URL "${canonicalUrl}".`);
    }

    const entityUrl = data.url;
    const pageEntity = data.mainEntityOfPage;
    const pageUrl = typeof pageEntity === "string"
      ? pageEntity
      : pageEntity && typeof pageEntity === "object" &&
          "@id" in pageEntity
        ? pageEntity["@id"]
        : undefined;

    for (const [field, value] of [
      ["url", entityUrl],
      ["mainEntityOfPage", pageUrl],
    ] as const) {
      if (value !== undefined && value !== canonical) {
        throw new Error(
          `Structured data ${field} does not match the canonical URL.`,
        );
      }
    }
  }

  return Object.freeze({ ...data, inLanguage: locale });
};
