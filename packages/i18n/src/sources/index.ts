import type { MessageCatalog } from "../runtime";

export interface CatalogSource {
  load(
    locale: string,
    namespace?: string,
    signal?: AbortSignal,
  ): Promise<MessageCatalog>;
  invalidate?(locale?: string, namespace?: string): void;
}

export interface RemoteCatalogSource extends CatalogSource {
  invalidate(locale?: string, namespace?: string): void;
}

export class CatalogSourceError extends Error {
  constructor(
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "CatalogSourceError";
  }
}

const isCatalogObject = (
  value: unknown,
): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const canonicalize = (locale: string): string => {
  try {
    const [canonical] = Intl.getCanonicalLocales(locale);

    if (!canonical) {
      throw new Error();
    }

    return canonical;
  } catch {
    throw new CatalogSourceError(`Invalid BCP 47 catalog locale "${locale}".`);
  }
};

const copyCatalog = (
  value: unknown,
  locale: string,
  path = "",
  ancestors = new WeakSet<object>(),
): MessageCatalog => {
  if (!isCatalogObject(value)) {
    throw new CatalogSourceError(
      `Catalog for "${locale}" at "${path || "<root>"}" must be a plain object.`,
    );
  }

  if (ancestors.has(value)) {
    throw new CatalogSourceError(
      `Catalog for "${locale}" contains a circular reference at "${path || "<root>"}".`,
    );
  }

  ancestors.add(value);
  const entries = Object.entries(value).map(([key, entry]) => {
    const keyPath = path ? `${path}.${key}` : key;

    if (!key || key.includes(".")) {
      throw new CatalogSourceError(
        `Catalog for "${locale}" has an invalid key "${key}" at "${path || "<root>"}".`,
      );
    }

    if (typeof entry === "string") {
      return [key, entry] as const;
    }

    return [key, copyCatalog(entry, locale, keyPath, ancestors)] as const;
  });

  ancestors.delete(value);
  return Object.freeze(Object.fromEntries(entries));
};

const selectNamespace = (
  catalog: MessageCatalog,
  namespace: string | undefined,
  locale: string,
): MessageCatalog => {
  if (!namespace) {
    return catalog;
  }

  let value: unknown = catalog;

  for (const part of namespace.split(".")) {
    if (!part || !isCatalogObject(value) || !Object.hasOwn(value, part)) {
      throw new CatalogSourceError(
        `Catalog namespace "${namespace}" was not found for "${locale}".`,
      );
    }

    value = value[part];
  }

  if (!isCatalogObject(value)) {
    throw new CatalogSourceError(
      `Catalog namespace "${namespace}" for "${locale}" is not an object.`,
    );
  }

  return value as MessageCatalog;
};

export const parseJsonCatalog = (
  json: string,
  locale: string,
): MessageCatalog => {
  const canonicalLocale = canonicalize(locale);
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch (error) {
    throw new CatalogSourceError(
      `Catalog JSON for "${canonicalLocale}" is invalid.`,
      { cause: error },
    );
  }

  return copyCatalog(parsed, canonicalLocale);
};

export interface MemoryCatalogSourceOptions {
  catalogs: Readonly<Record<string, MessageCatalog>>;
}

export const createMemoryCatalogSource = (
  options: MemoryCatalogSourceOptions,
): CatalogSource => {
  const catalogs = new Map<string, MessageCatalog>();

  for (const [inputLocale, catalog] of Object.entries(options.catalogs)) {
    const locale = canonicalize(inputLocale);

    if (catalogs.has(locale)) {
      throw new CatalogSourceError(`Duplicate catalog for locale "${locale}".`);
    }

    catalogs.set(locale, copyCatalog(catalog, locale));
  }

  return Object.freeze({
    async load(locale: string, namespace?: string, signal?: AbortSignal) {
      if (signal?.aborted) {
        throw signal.reason ?? new DOMException("Aborted", "AbortError");
      }

      const canonicalLocale = canonicalize(locale);
      const catalog = catalogs.get(canonicalLocale);

      if (!catalog) {
        throw new CatalogSourceError(
          `No in-memory catalog exists for "${canonicalLocale}".`,
        );
      }

      return selectNamespace(
        catalog,
        namespace,
        canonicalLocale,
      );
    },
  });
};

export interface CatalogValidationContext {
  readonly locale: string;
}

export type CatalogSchemaValidator = (
  catalog: unknown,
  context: CatalogValidationContext,
) => void;

export interface TypeScriptCatalogSourceOptions<
  Catalogs extends Readonly<Record<string, MessageCatalog>>,
> {
  catalogs: Catalogs;
  validate?: CatalogSchemaValidator;
}

export interface TypeScriptCatalogSource<
  Catalogs extends Readonly<Record<string, MessageCatalog>>,
> {
  load(
    locale: string,
    namespace?: undefined,
    signal?: AbortSignal,
  ): Promise<Catalogs[keyof Catalogs]>;
  load(
    locale: string,
    namespace: string,
    signal?: AbortSignal,
  ): Promise<MessageCatalog>;
}

export const createTypeScriptCatalogSource = <
  Catalogs extends Readonly<Record<string, MessageCatalog>>,
>(
  options: TypeScriptCatalogSourceOptions<Catalogs>,
): TypeScriptCatalogSource<Catalogs> => {
  const catalogs = new Map<string, MessageCatalog>();

  for (const [inputLocale, inputCatalog] of Object.entries(options.catalogs)) {
    const locale = canonicalize(inputLocale);

    if (catalogs.has(locale)) {
      throw new CatalogSourceError(`Duplicate catalog for locale "${locale}".`);
    }

    const catalog = copyCatalog(inputCatalog, locale);
    options.validate?.(catalog, { locale });
    catalogs.set(locale, catalog);
  }

  return Object.freeze({
    async load(locale: string, namespace?: string, signal?: AbortSignal) {
      if (signal?.aborted) {
        throw signal.reason ?? new DOMException("Aborted", "AbortError");
      }

      const canonicalLocale = canonicalize(locale);
      const catalog = catalogs.get(canonicalLocale);

      if (!catalog) {
        throw new CatalogSourceError(
          `No TypeScript catalog exists for "${canonicalLocale}".`,
        );
      }

      return selectNamespace(catalog, namespace, canonicalLocale);
    },
  }) as TypeScriptCatalogSource<Catalogs>;
};

export interface RemoteCatalogSourceOptions {
  url(locale: string, namespace?: string): string | URL;
  headers?: HeadersInit;
  fetcher?: typeof fetch;
  timeoutMs?: number;
  retries?: number;
  cacheTtlMs?: number;
  maxResponseBytes?: number;
}

interface CachedCatalog {
  catalog: MessageCatalog;
  expiresAt: number;
}

const validateRemoteUrl = (value: string | URL): URL => {
  let url: URL;

  try {
    url = new URL(value);
  } catch (error) {
    throw new CatalogSourceError("Remote catalog URL must be absolute.", {
      cause: error,
    });
  }

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    url.username ||
    url.password ||
    url.hash
  ) {
    throw new CatalogSourceError(
      "Remote catalog URLs must use HTTP(S) and must not contain credentials or a hash.",
    );
  }

  return url;
};

const wait = (milliseconds: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, milliseconds);
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(signal?.reason ?? new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });

export const createRemoteCatalogSource = (
  options: RemoteCatalogSourceOptions,
): RemoteCatalogSource => {
  const timeoutMs = options.timeoutMs ?? 5_000;
  const retries = options.retries ?? 1;
  const cacheTtlMs = options.cacheTtlMs ?? 30_000;
  const maxResponseBytes = options.maxResponseBytes ?? 1_048_576;
  const fetcher = options.fetcher ?? globalThis.fetch;
  const headers = new Headers(options.headers);
  const cache = new Map<string, CachedCatalog>();
  const encoder = new TextEncoder();

  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60_000) {
    throw new RangeError("Remote catalog timeoutMs must be between 1 and 60000.");
  }

  if (!Number.isInteger(retries) || retries < 0 || retries > 5) {
    throw new RangeError("Remote catalog retries must be between 0 and 5.");
  }

  if (!Number.isInteger(cacheTtlMs) || cacheTtlMs < 0) {
    throw new RangeError("Remote catalog cacheTtlMs must be a non-negative integer.");
  }

  if (
    !Number.isInteger(maxResponseBytes) ||
    maxResponseBytes < 1 ||
    maxResponseBytes > 10_485_760
  ) {
    throw new RangeError(
      "Remote catalog maxResponseBytes must be between 1 and 10485760.",
    );
  }

  if (typeof fetcher !== "function") {
    throw new CatalogSourceError("A Fetch-compatible implementation is required.");
  }

  const load = async (
    inputLocale: string,
    namespace?: string,
    signal?: AbortSignal,
  ): Promise<MessageCatalog> => {
    const locale = canonicalize(inputLocale);
    if (signal?.aborted) {
      throw signal.reason ?? new DOMException("Aborted", "AbortError");
    }

    let url: URL;

    try {
      url = validateRemoteUrl(options.url(locale, namespace));
    } catch (error) {
      if (error instanceof CatalogSourceError) {
        throw error;
      }

      throw new CatalogSourceError(
        `Could not resolve a remote catalog URL for "${locale}".`,
        { cause: error },
      );
    }

    const cacheKey = `${locale}\u0000${namespace ?? ""}\u0000${url.href}`;
    const cached = cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.catalog;
    }

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const controller = new AbortController();
      let timedOut = false;
      const timeout = setTimeout(
        () => {
          timedOut = true;
          controller.abort(new Error("Remote catalog request timed out."));
        },
        timeoutMs,
      );
      const abortFromCaller = () =>
        controller.abort(
          signal?.reason ?? new DOMException("Aborted", "AbortError"),
        );
      signal?.addEventListener("abort", abortFromCaller, { once: true });

      let retryStatus: number | undefined;
      let retryNetworkFailure = false;
      let payload: unknown;

      try {
        const response = await fetcher(url, {
          headers: new Headers(headers),
          signal: controller.signal,
          redirect: "error",
        });

        const isRedirectStatus =
          response.status >= 300 && response.status < 400;

        if (response.redirected || isRedirectStatus) {
          const statusDetail = isRedirectStatus
            ? ` (HTTP ${response.status})`
            : "";

          throw new CatalogSourceError(
            `Remote catalog redirects are not allowed${statusDetail}.`,
          );
        }

        if (!response.ok) {
          const retryable =
            response.status === 408 ||
            response.status === 429 ||
            response.status >= 500;

          if (retryable && attempt < retries) {
            retryStatus = response.status;
          } else {
            throw new CatalogSourceError(
              `Remote catalog request for "${locale}" returned HTTP ${response.status}.`,
            );
          }
        } else {
          const declaredLength = Number(response.headers.get("content-length"));

          if (Number.isFinite(declaredLength) && declaredLength > maxResponseBytes) {
            throw new CatalogSourceError(
              `Remote catalog response for "${locale}" exceeds the configured size limit.`,
            );
          }

          try {
            const body = await response.text();

            if (encoder.encode(body).byteLength > maxResponseBytes) {
              throw new CatalogSourceError(
                `Remote catalog response for "${locale}" exceeds the configured size limit.`,
              );
            }

            payload = JSON.parse(body);
          } catch (error) {
            if (error instanceof CatalogSourceError) {
              throw error;
            }

            if (signal?.aborted) {
              throw signal.reason ?? error;
            }

            if (timedOut) {
              throw new CatalogSourceError(
                `Remote catalog request for "${locale}" timed out.`,
                { cause: error },
              );
            }

            throw new CatalogSourceError(
              `Remote catalog response for "${locale}" was not valid JSON.`,
              { cause: error },
            );
          }
        }
      } catch (error) {
        if (error instanceof CatalogSourceError) {
          throw error;
        }

        if (signal?.aborted) {
          throw signal.reason ?? error;
        }

        if (timedOut) {
          throw new CatalogSourceError(
            `Remote catalog request for "${locale}" timed out.`,
            { cause: error },
          );
        }

        if (attempt < retries) {
          retryNetworkFailure = true;
        } else {
          throw new CatalogSourceError(
            `Remote catalog request for "${locale}" failed.`,
            { cause: error },
          );
        }
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener("abort", abortFromCaller);
      }

      if (retryStatus !== undefined || retryNetworkFailure) {
        await wait(100 * 2 ** attempt, signal);
        continue;
      }

      if (signal?.aborted) {
        throw signal.reason ?? new DOMException("Aborted", "AbortError");
      }

      const catalog = copyCatalog(payload, locale);
      const selectedCatalog = selectNamespace(catalog, namespace, locale);

      if (cacheTtlMs > 0) {
        cache.set(cacheKey, {
          catalog: selectedCatalog,
          expiresAt: Date.now() + cacheTtlMs,
        });
      }

      return selectedCatalog;
    }

    throw new CatalogSourceError(
      `Remote catalog request for "${locale}" exhausted its retries.`,
    );
  };

  const invalidate = (inputLocale?: string, namespace?: string): void => {
    if (!inputLocale) {
      cache.clear();
      return;
    }

    const locale = canonicalize(inputLocale);

    if (namespace !== undefined) {
      const namespacePrefix = `${locale}\u0000${namespace}\u0000`;

      for (const key of cache.keys()) {
        if (key.startsWith(namespacePrefix)) {
          cache.delete(key);
        }
      }

      return;
    }

    for (const key of cache.keys()) {
      if (key.startsWith(`${locale}\u0000`)) {
        cache.delete(key);
      }
    }
  };

  return Object.freeze({ load, invalidate });
};
