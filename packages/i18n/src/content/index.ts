import type { LocaleRegistry } from "../locale";

export type ContentStatus = "draft" | "published";
export type ContentVersion = string | number;

export interface LocalizedContentDocument<Data> {
  readonly id: string;
  readonly locale: string;
  readonly slug: string;
  readonly status: ContentStatus;
  readonly version: ContentVersion;
  readonly content: Data;
}

export interface ContentQuery {
  readonly locale: string;
  readonly slug: string;
  readonly version?: ContentVersion;
  readonly preview: boolean;
}

export interface ContentSource<Data> {
  load(
    query: ContentQuery,
    signal?: AbortSignal,
  ): Promise<LocalizedContentDocument<Data> | undefined>;
}

export interface ContentAdapterContext {
  readonly signal?: AbortSignal;
}

export interface ContentAdapter<Data> {
  load(
    query: ContentQuery,
    context: ContentAdapterContext,
  ): Promise<LocalizedContentDocument<Data> | undefined>;
}

export interface ContentAdapterSourceOptions {
  cacheTtlMs?: number;
  maxEntries?: number;
}

export interface ContentAdapterSource<Data> extends ContentSource<Data> {
  invalidate(): void;
}

interface CachedContent<Data> {
  readonly expiresAt: number;
  readonly document: LocalizedContentDocument<Data> | undefined;
}

export const createContentSourceAdapter = <Data>(
  adapter: ContentAdapter<Data>,
  options: ContentAdapterSourceOptions = {},
): ContentAdapterSource<Data> => {
  const cacheTtlMs = options.cacheTtlMs ?? 0;
  const maxEntries = options.maxEntries ?? 100;
  const cache = new Map<string, CachedContent<Data>>();

  if (!Number.isInteger(cacheTtlMs) || cacheTtlMs < 0) {
    throw new RangeError("Content adapter cacheTtlMs must be a non-negative integer.");
  }

  if (!Number.isInteger(maxEntries) || maxEntries < 1) {
    throw new RangeError("Content adapter maxEntries must be a positive integer.");
  }

  const load = async (
    query: ContentQuery,
    signal?: AbortSignal,
  ): Promise<LocalizedContentDocument<Data> | undefined> => {
    if (signal?.aborted) {
      throw signal.reason ?? new DOMException("Aborted", "AbortError");
    }

    const locale = (() => {
      try {
        return Intl.getCanonicalLocales(query.locale)[0];
      } catch {
        return undefined;
      }
    })();

    if (!locale) {
      throw new Error(`Invalid content locale "${query.locale}".`);
    }

    validateSlug(query.slug);
    validateVersion(query.version);

    if (typeof query.preview !== "boolean") {
      throw new Error("Content preview state must be a boolean.");
    }

    const normalizedQuery = Object.freeze({ ...query, locale });
    const cacheKey = JSON.stringify([
      locale,
      normalizedQuery.slug,
      normalizedQuery.version === undefined
        ? null
        : [typeof normalizedQuery.version, normalizedQuery.version],
      normalizedQuery.preview,
    ]);
    const cached = cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.document;
    }

    const document = await adapter.load(
      normalizedQuery,
      Object.freeze({ signal }),
    );

    if (signal?.aborted) {
      throw signal.reason ?? new DOMException("Aborted", "AbortError");
    }

    if (cacheTtlMs > 0) {
      cache.delete(cacheKey);
      cache.set(cacheKey, {
        expiresAt: Date.now() + cacheTtlMs,
        document: document ? Object.freeze({ ...document }) : undefined,
      });

      while (cache.size > maxEntries) {
        const oldestKey = cache.keys().next().value;

        if (oldestKey === undefined) {
          break;
        }

        cache.delete(oldestKey);
      }
    }

    return document;
  };

  return Object.freeze({
    load,
    invalidate() {
      cache.clear();
    },
  });
};

export type LocalizedContentSlugDefinitions = Readonly<
  Record<string, Readonly<Record<string, string>>>
>;

export type LocalizedContentSlugMap = Readonly<
  Record<string, Readonly<Record<string, string>>>
>;

export interface ContentResolutionOptions<Data> {
  registry: LocaleRegistry;
  source: ContentSource<Data>;
  localizedSlugs?: LocalizedContentSlugMap;
  validate?: (
    content: Data,
    document: LocalizedContentDocument<Data>,
  ) => void | Promise<void>;
}

interface ResolveContentBaseOptions {
  locale: string;
  version?: ContentVersion;
  preview?: boolean;
  signal?: AbortSignal;
}

export type ResolveContentOptions = ResolveContentBaseOptions &
  (
    | { slug: string; routeId?: never }
    | { routeId: string; slug?: never }
  );

export type ContentResolution<Data> =
  | {
      status: "found";
      requestedLocale: string;
      locale: string;
      usedFallback: boolean;
      routeId?: string;
      document: LocalizedContentDocument<Data>;
    }
  | {
      status: "missing";
      requestedLocale: string;
      slug?: string;
      routeId?: string;
      version?: ContentVersion;
    };

const validateSlug = (slug: string): void => {
  const segments = slug.split("/");

  if (
    !slug ||
    slug.startsWith("/") ||
    slug.includes("\\") ||
    slug.includes("?") ||
    slug.includes("#") ||
    /[\u0000-\u001f\u007f]/.test(slug) ||
    segments.some((segment) => {
      if (!segment || segment === "." || segment === "..") {
        return true;
      }

      try {
        const decoded = decodeURIComponent(segment);
        return (
          decoded === "." ||
          decoded === ".." ||
          decoded.includes("/") ||
          decoded.includes("\\") ||
          /[\u0000-\u001f\u007f]/.test(decoded)
        );
      } catch {
        return true;
      }
    })
  ) {
    throw new Error(`Invalid localized content slug "${slug}".`);
  }
};

const validateVersion = (version: ContentVersion | undefined): void => {
  if (
    version !== undefined &&
    ((typeof version !== "string" && typeof version !== "number") ||
      (typeof version === "string" &&
        (!version.trim() || /[\u0000-\u001f\u007f]/.test(version))) ||
      (typeof version === "number" && !Number.isFinite(version)))
  ) {
    throw new Error("Content version must be a non-empty string or finite number.");
  }
};

export const createLocalizedContentSlugMap = (
  registry: LocaleRegistry,
  definitions: LocalizedContentSlugDefinitions,
): LocalizedContentSlugMap => {
  const routes = Object.create(null) as Record<
    string,
    Readonly<Record<string, string>>
  >;
  const ownersByLocale = new Map<string, Map<string, string>>();

  for (const [routeId, localizedSlugs] of Object.entries(definitions)) {
    if (!routeId.trim() || /[\u0000-\u001f\u007f]/.test(routeId)) {
      throw new Error(`Invalid localized content route id "${routeId}".`);
    }

    const slugs: Record<string, string> = {};

    for (const [inputLocale, slug] of Object.entries(localizedSlugs)) {
      const locale = registry.resolve(inputLocale);

      if (!locale) {
        throw new Error(`Unsupported locale "${inputLocale}" in route "${routeId}".`);
      }

      if (Object.hasOwn(slugs, locale)) {
        throw new Error(
          `Duplicate localized slug locale "${locale}" in route "${routeId}".`,
        );
      }

      validateSlug(slug);
      const owners = ownersByLocale.get(locale) ?? new Map<string, string>();
      const existingOwner = owners.get(slug);

      if (existingOwner) {
        throw new Error(
          `Localized slug "${slug}" for "${locale}" is shared by routes "${existingOwner}" and "${routeId}".`,
        );
      }

      owners.set(slug, routeId);
      ownersByLocale.set(locale, owners);
      slugs[locale] = slug;
    }

    if (Object.keys(slugs).length === 0) {
      throw new Error(`Route "${routeId}" must define at least one localized slug.`);
    }

    routes[routeId] = Object.freeze(slugs);
  }

  return Object.freeze(routes);
};

const findLocalizedContentRoute = (
  registry: LocaleRegistry,
  localizedSlugs: LocalizedContentSlugMap,
  inputLocale: string,
  slug: string,
): string | undefined => {
  const locale = registry.resolve(inputLocale);

  if (!locale) {
    throw new Error(`Unsupported content locale "${inputLocale}".`);
  }

  validateSlug(slug);

  for (const [routeId, slugs] of Object.entries(localizedSlugs)) {
    if (slugs[locale] === slug) {
      return routeId;
    }
  }

  return undefined;
};

export const createContentResolver = <Data>(
  options: ContentResolutionOptions<Data>,
) => {
  const localizedSlugMap = options.localizedSlugs
    ? createLocalizedContentSlugMap(options.registry, options.localizedSlugs)
    : undefined;

  return {
    async resolve(
      request: ResolveContentOptions,
    ): Promise<ContentResolution<Data>> {
      const requestedLocale = options.registry.resolve(request.locale);

      if (!requestedLocale) {
        throw new Error(`Unsupported content locale "${request.locale}".`);
      }

      validateVersion(request.version);

      const explicitRouteId =
        "routeId" in request ? request.routeId : undefined;
      const requestedSlug = "slug" in request ? request.slug : undefined;
      const routeId =
        explicitRouteId ??
        (requestedSlug && localizedSlugMap
          ? findLocalizedContentRoute(
              options.registry,
              localizedSlugMap,
              requestedLocale,
              requestedSlug,
            )
          : undefined);
      const localizedSlugs = routeId !== undefined
        ? localizedSlugMap?.[routeId]
        : undefined;

      if (explicitRouteId !== undefined && !localizedSlugs) {
        throw new Error(`Unknown localized content route "${routeId}".`);
      }

      if (requestedSlug !== undefined) {
        validateSlug(requestedSlug);
      }

      for (const locale of options.registry.fallbackChain(requestedLocale)) {
        if (request.signal?.aborted) {
          throw request.signal.reason ?? new DOMException("Aborted", "AbortError");
        }

        const slug = localizedSlugs?.[locale] ?? requestedSlug;

        if (!slug) {
          continue;
        }

        const document = await options.source.load(
          {
            locale,
            slug,
            version: request.version,
            preview: request.preview ?? false,
          },
          request.signal,
        );

        if (!document) {
          continue;
        }

        if (
          typeof document.id !== "string" ||
          !document.id.trim() ||
          typeof document.locale !== "string" ||
          typeof document.slug !== "string"
        ) {
          throw new Error("Content source returned a malformed document.");
        }

        const documentLocale = options.registry.resolve(document.locale);

        if (documentLocale !== locale) {
          throw new Error(
            `Content source returned locale "${document.locale}" for requested locale "${locale}".`,
          );
        }

        if (document.slug !== slug) {
          throw new Error(
            `Content source returned slug "${document.slug}" for requested slug "${slug}".`,
          );
        }

        if (
          document.status !== "published" &&
          document.status !== "draft"
        ) {
          throw new Error(
            `Content source returned an invalid status for "${document.id}".`,
          );
        }

        validateVersion(document.version);

        if (
          (document.status === "draft" && !request.preview) ||
          (request.version !== undefined &&
            String(document.version) !== String(request.version))
        ) {
          continue;
        }

        const immutableDocument = Object.freeze({ ...document });
        await options.validate?.(immutableDocument.content, immutableDocument);

        return Object.freeze({
          status: "found",
          requestedLocale,
          locale,
          usedFallback: locale !== requestedLocale,
          ...(routeId ? { routeId } : {}),
          document: immutableDocument,
        });
      }

      return Object.freeze({
        status: "missing",
        requestedLocale,
        ...(requestedSlug ? { slug: requestedSlug } : { routeId }),
        version: request.version,
      });
    },
  };
};

export { createSanityContentSource, SANITY_CONTENT_QUERY } from "./sanity";
export type {
  SanityContentClient,
  SanityContentFetchOptions,
  SanityContentQueryParams,
  SanityContentSourceOptions,
} from "./sanity";
