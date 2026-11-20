import IntlMessageFormat, {
  type FormatXMLElementFn,
} from "intl-messageformat";

import { createLocaleRegistry } from "./locale";

import type { LocaleDefinition, LocaleRegistry } from "./locale";

export type MessageValue = string | number | Date | boolean | null | undefined;
export type MessageValues = Readonly<Record<string, MessageValue>>;
export type RichMessageValues<Node> = Readonly<
  Record<string, MessageValue | Node | FormatXMLElementFn<Node>>
>;
export type RichMessageResult<Node> =
  | string
  | Node
  | readonly (string | Node)[];
export interface MessageCatalog {
  readonly [key: string]: MessageEntry;
}
export type MessageEntry = string | MessageCatalog;

type Trim<Value extends string> = Value extends
  | ` ${infer Rest}`
  | `\n${infer Rest}`
  | `\t${infer Rest}`
  ? Trim<Rest>
  : Value extends `${infer Rest} `
    | `${infer Rest}\n`
    | `${infer Rest}\t`
    ? Trim<Rest>
    : Value;

type ValidMessageVariable<Name extends string> = Name extends
  | ""
  | `#${string}`
  | `${string} ${string}`
  ? never
  : Name;

type MessageVariables<Message extends string> =
  Message extends `${string}{${infer Token}}${infer Rest}`
    ? ValidMessageVariable<
        Token extends `${infer Name},${string}` ? Trim<Name> : Trim<Token>
      > |
        MessageVariables<Rest>
    : never;

export type MessageKeys<Catalog> = Catalog extends MessageCatalog
  ? {
      [Key in keyof Catalog & string]: Catalog[Key] extends string
        ? Key
        : Catalog[Key] extends MessageCatalog
          ? `${Key}.${MessageKeys<Catalog[Key]>}`
          : never;
    }[keyof Catalog & string]
  : never;

export type MessageAtPath<Catalog, Path extends string> = Catalog extends MessageCatalog
  ? Path extends `${infer Head}.${infer Tail}`
    ? Head extends keyof Catalog
      ? MessageAtPath<Catalog[Head], Tail>
      : never
    : Path extends keyof Catalog
      ? Catalog[Path]
      : never
  : never;

type TranslationArgs<Message> = [Message] extends [string]
  ? [MessageVariables<Extract<Message, string>>] extends [never]
    ? []
    : [values: Readonly<
        Record<MessageVariables<Extract<Message, string>>, MessageValue>
      >]
  : [];

export type RichTranslationArgs<Message, Node> = [Message] extends [string]
  ? [MessageVariables<Extract<Message, string>>] extends [never]
    ? [values?: RichMessageValues<Node>]
    : [
        values: Readonly<
          Partial<Record<string, MessageValue | Node | FormatXMLElementFn<Node>>> &
            Record<
              MessageVariables<Extract<Message, string>>,
              MessageValue | Node | FormatXMLElementFn<Node>
            >
        >,
      ]
  : [];

export type TranslationKey<Catalog extends MessageCatalog> =
  MessageKeys<Catalog>;

export interface NamespaceLoader {
  load(
    locale: string,
    namespace: string,
    signal?: AbortSignal,
  ): Promise<MessageCatalog>;
}

export interface I18nOptions<
  Catalogs extends Readonly<Record<string, MessageCatalog>>,
> {
  locales: readonly LocaleDefinition[];
  defaultLocale: string;
  fallbackLocale?: string;
  catalogs: Catalogs;
  namespaceLoader?: NamespaceLoader;
  onMissingKey?: (event: MissingTranslationEvent) => void;
  onFallback?: (event: TranslationFallbackEvent) => void;
  onEvent?: (event: I18nRuntimeEvent) => void;
}

export interface MissingTranslationEvent {
  key: string;
  locale: string;
}

export interface TranslationFallbackEvent {
  key: string;
  requestedLocale: string;
  resolvedLocale: string;
}

export type I18nRuntimeEvent =
  | ({ type: "missing-key" } & MissingTranslationEvent)
  | ({ type: "fallback" } & TranslationFallbackEvent)
  | {
      type: "route";
      pathname: string;
      status: "matched" | "redirected" | "unmatched";
      locale?: string;
      routeId?: string;
    }
  | {
      type: "namespace-load";
      locale: string;
      namespace: string;
      status: "started" | "loaded" | "failed";
    };

export interface Translator<Catalog extends MessageCatalog> {
  readonly locale: string;
  t<Key extends MessageKeys<Catalog>>(
    key: Key,
    ...args: TranslationArgs<MessageAtPath<Catalog, Key>>
  ): string;
  rich<Key extends MessageKeys<Catalog>, Node = never>(
    key: Key,
    ...args: RichTranslationArgs<MessageAtPath<Catalog, Key>, Node>
  ): RichMessageResult<Node>;
}

export interface I18nInstance<Catalog extends MessageCatalog> {
  readonly registry: LocaleRegistry;
  readonly catalogs: Readonly<Record<string, Catalog>>;
  createTranslator(locale: string): Translator<Catalog>;
  isNamespaceLoaded(locale: string, namespace: string): boolean;
  loadNamespace(
    locale: string,
    namespace: string,
    options?: { signal?: AbortSignal },
  ): Promise<void>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const cloneCatalog = (
  catalog: MessageCatalog,
  prefix = "",
  ancestors = new WeakSet<object>(),
): MessageCatalog => {
  if (!isPlainRecord(catalog)) {
    throw new Error(
      `Catalog value at "${prefix || "<root>"}" must be a plain object.`,
    );
  }

  if (ancestors.has(catalog)) {
    throw new Error(
      `Catalog value at "${prefix || "<root>"}" contains a circular reference.`,
    );
  }

  ancestors.add(catalog);
  const entries = Object.entries(catalog).map(([key, value]) => {
    if (!key || key.includes(".")) {
      throw new Error(
        `Catalog key "${key}" is empty or contains ".", which is reserved for nested paths.`,
      );
    }

    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      return [key, value] as const;
    }

    if (!isPlainRecord(value)) {
      throw new Error(`Catalog value at "${path}" must be a plain object or string.`);
    }

    return [key, cloneCatalog(value as MessageCatalog, path, ancestors)] as const;
  });

  ancestors.delete(catalog);
  return Object.freeze(Object.fromEntries(entries));
};

const getCatalogMessage = (
  catalog: MessageCatalog | undefined,
  key: string,
): string | undefined => {
  if (!catalog) {
    return undefined;
  }

  let value: unknown = catalog;

  for (const part of key.split(".")) {
    if (!isRecord(value) || !Object.hasOwn(value, part)) {
      return undefined;
    }

    value = value[part];
  }

  return typeof value === "string" ? value : undefined;
};

const getNamespaceSegments = (namespace: string): string[] => {
  const segments = namespace.split(".");

  if (
    !namespace ||
    segments.some((segment) => !/^[A-Za-z0-9_-]+$/.test(segment))
  ) {
    throw new Error(`Invalid translation namespace "${namespace}".`);
  }

  return segments;
};

const mergeCatalogs = (
  current: MessageCatalog,
  incoming: MessageCatalog,
): MessageCatalog => {
  const merged: Record<string, MessageEntry> = { ...current };

  for (const [key, incomingValue] of Object.entries(incoming)) {
    const currentValue = merged[key];

    merged[key] =
      typeof currentValue === "object" &&
      currentValue !== null &&
      typeof incomingValue === "object"
        ? mergeCatalogs(
            currentValue as MessageCatalog,
            incomingValue as MessageCatalog,
          )
        : incomingValue;
  }

  return Object.freeze(merged);
};

const mergeAtNamespace = (
  catalog: MessageCatalog,
  segments: readonly string[],
  namespaceCatalog: MessageCatalog,
): MessageCatalog => {
  const [segment, ...remaining] = segments;

  if (!segment) {
    return mergeCatalogs(catalog, namespaceCatalog);
  }

  const currentValue = catalog[segment];

  if (currentValue !== undefined && typeof currentValue === "string") {
    throw new Error(
      `Translation namespace "${segments.join(".")}" conflicts with a message key.`,
    );
  }

  const currentNamespace =
    currentValue && typeof currentValue === "object"
      ? currentValue
      : Object.freeze({});
  const mergedNamespace =
    remaining.length > 0
      ? mergeAtNamespace(
          currentNamespace,
          remaining,
          namespaceCatalog,
        )
      : mergeCatalogs(currentNamespace, namespaceCatalog);

  return Object.freeze({
    ...catalog,
    [segment]: mergedNamespace,
  });
};

interface PendingNamespaceLoad {
  controller: AbortController;
  promise: Promise<void>;
  waiters: number;
  settled: boolean;
}

const abortReason = (signal: AbortSignal): unknown =>
  signal.reason ?? new DOMException("Aborted", "AbortError");

export const createI18n = <
  const Catalogs extends Readonly<Record<string, MessageCatalog>>,
>(
  options: I18nOptions<Catalogs>,
): I18nInstance<Catalogs[keyof Catalogs]> => {
  const registry = createLocaleRegistry({
    locales: options.locales,
    defaultLocale: options.defaultLocale,
    fallbackLocale: options.fallbackLocale,
  });
  const catalogs: Record<string, Catalogs[keyof Catalogs]> = {};

  for (const [locale, catalog] of Object.entries(options.catalogs)) {
    const resolvedLocale = registry.resolve(locale);

    if (!resolvedLocale) {
      throw new Error(`Catalog locale "${locale}" is not supported.`);
    }

    if (Object.hasOwn(catalogs, resolvedLocale)) {
      throw new Error(`Multiple catalogs resolve to "${resolvedLocale}".`);
    }

    catalogs[resolvedLocale] = cloneCatalog(
      catalog,
    ) as Catalogs[keyof Catalogs];
  }

  const loadedNamespaces = new Map<string, Set<string>>();
  const pendingNamespaceLoads = new Map<string, PendingNamespaceLoad>();
  const emit = (event: I18nRuntimeEvent): void => {
    options.onEvent?.(Object.freeze(event));
  };

  const createTranslator = (
    inputLocale: string,
  ): Translator<Catalogs[keyof Catalogs]> => {
    const locale = registry.resolve(inputLocale);

    if (!locale) {
      throw new Error(`Unsupported locale "${inputLocale}".`);
    }

    const fallbackChain = registry.fallbackChain(locale);
    const formatterCache = new Map<string, IntlMessageFormat>();
    const resolveMessage = (
      key: string,
    ): { message: string; locale: string } | undefined => {
      for (const candidate of fallbackChain) {
        const message = getCatalogMessage(catalogs[candidate], key);

        if (message !== undefined) {
          if (candidate !== locale) {
            const event = {
              key,
              requestedLocale: locale,
              resolvedLocale: candidate,
            };
            options.onFallback?.(event);
            emit({ type: "fallback", ...event });
          }

          return { message, locale: candidate };
        }
      }

      const event = { key, locale };
      options.onMissingKey?.(event);
      emit({ type: "missing-key", ...event });
      return undefined;
    };
    const getFormatter = (message: string, resolvedLocale: string) => {
      const cacheKey = `${resolvedLocale}\u0000${message}`;
      let formatter = formatterCache.get(cacheKey);

      if (!formatter) {
        formatter = new IntlMessageFormat(message, resolvedLocale);
        formatterCache.set(cacheKey, formatter);
      }

      return formatter;
    };

    const t = <
      Key extends MessageKeys<Catalogs[keyof Catalogs]>,
    >(
      key: Key,
      ...args: TranslationArgs<
        MessageAtPath<Catalogs[keyof Catalogs], Key>
      >
    ): string => {
      const values = args[0] as MessageValues | undefined;
      const resolved = resolveMessage(String(key));

      if (!resolved) {
        return String(key);
      }

      const result = getFormatter(
        resolved.message,
        resolved.locale,
      ).format(values);

      if (typeof result !== "string") {
        throw new Error(
          `Translation "${String(key)}" contains rich text. Use a rich-text formatter instead of t().`,
        );
      }

      return result;
    };

    const rich = <
      Key extends MessageKeys<Catalogs[keyof Catalogs]>,
      Node = never,
    >(
      key: Key,
      ...args: RichTranslationArgs<
        MessageAtPath<Catalogs[keyof Catalogs], Key>,
        Node
      >
    ): RichMessageResult<Node> => {
      const values = args[0] as RichMessageValues<Node> | undefined;
      const resolved = resolveMessage(String(key));

      if (!resolved) {
        return String(key);
      }

      return getFormatter(
        resolved.message,
        resolved.locale,
      ).format<Node>(values);
    };

    return Object.freeze({ locale, t, rich });
  };

  const isNamespaceLoaded = (inputLocale: string, namespace: string): boolean => {
    const locale = registry.resolve(inputLocale);

    if (!locale) {
      throw new Error(`Unsupported locale "${inputLocale}".`);
    }

    const normalizedNamespace = getNamespaceSegments(namespace).join(".");
    return loadedNamespaces.get(locale)?.has(normalizedNamespace) ?? false;
  };

  const waitForNamespaceLoad = (
    pending: PendingNamespaceLoad,
    signal?: AbortSignal,
  ): Promise<void> => {
    if (signal?.aborted) {
      return Promise.reject(abortReason(signal));
    }

    pending.waiters += 1;

    return new Promise<void>((resolve, reject) => {
      let active = true;
      const release = (): void => {
        if (!active) {
          return;
        }

        active = false;
        signal?.removeEventListener("abort", onAbort);
        pending.waiters -= 1;

        if (!pending.settled && pending.waiters === 0) {
          pending.controller.abort();
        }
      };
      const onAbort = (): void => {
        release();
        reject(signal ? abortReason(signal) : new DOMException("Aborted", "AbortError"));
      };

      signal?.addEventListener("abort", onAbort, { once: true });
      pending.promise.then(
        () => {
          release();
          resolve();
        },
        (error: unknown) => {
          release();
          reject(error);
        },
      );
    });
  };

  const loadOneNamespace = (
    locale: string,
    namespace: string,
    segments: readonly string[],
    signal?: AbortSignal,
  ): Promise<void> => {
    const loaded = loadedNamespaces.get(locale);

    if (loaded?.has(namespace)) {
      return Promise.resolve();
    }

    if (!options.namespaceLoader) {
      return Promise.reject(
        new Error(
          "A namespaceLoader must be configured before loading namespaces.",
        ),
      );
    }

    if (signal?.aborted) {
      return Promise.reject(abortReason(signal));
    }

    const loadKey = `${locale}\u0000${namespace}`;
    let pending = pendingNamespaceLoads.get(loadKey);

    if (!pending) {
      const namespaceLoader = options.namespaceLoader;
      const controller = new AbortController();
      const created: PendingNamespaceLoad = {
        controller,
        promise: Promise.resolve(),
        waiters: 0,
        settled: false,
      };
      const load = async (): Promise<void> => {
        emit({ type: "namespace-load", locale, namespace, status: "started" });

        try {
          const loadedCatalog = await namespaceLoader.load(
            locale,
            namespace,
            controller.signal,
          );

          if (controller.signal.aborted) {
            throw abortReason(controller.signal);
          }

          const namespaceSnapshot = cloneCatalog(
            loadedCatalog,
            `${locale}.${namespace}`,
          );
          const currentCatalog = catalogs[locale] ?? Object.freeze({});
          catalogs[locale] = mergeAtNamespace(
            currentCatalog,
            segments,
            namespaceSnapshot,
          ) as Catalogs[keyof Catalogs];

          const localeNamespaces =
            loadedNamespaces.get(locale) ?? new Set<string>();
          localeNamespaces.add(namespace);
          loadedNamespaces.set(locale, localeNamespaces);
        } catch (error) {
          emit({ type: "namespace-load", locale, namespace, status: "failed" });
          throw error;
        }

        emit({ type: "namespace-load", locale, namespace, status: "loaded" });
      };

      created.promise = Promise.resolve()
        .then(load)
        .finally(() => {
          created.settled = true;

          if (pendingNamespaceLoads.get(loadKey) === created) {
            pendingNamespaceLoads.delete(loadKey);
          }
        });
      pendingNamespaceLoads.set(loadKey, created);
      pending = created;
    }

    if (!pending) {
      return Promise.reject(new Error("Could not start namespace loading."));
    }

    return waitForNamespaceLoad(pending, signal);
  };

  const loadNamespace = async (
    inputLocale: string,
    namespace: string,
    loadOptions: { signal?: AbortSignal } = {},
  ): Promise<void> => {
    const locale = registry.resolve(inputLocale);

    if (!locale) {
      throw new Error(`Unsupported locale "${inputLocale}".`);
    }

    const segments = getNamespaceSegments(namespace);
    const normalizedNamespace = segments.join(".");

    for (const candidate of registry.fallbackChain(locale)) {
      await loadOneNamespace(
        candidate,
        normalizedNamespace,
        segments,
        loadOptions.signal,
      );
    }
  };

  return Object.freeze({
    registry,
    get catalogs() {
      return Object.freeze({ ...catalogs });
    },
    createTranslator,
    isNamespaceLoaded,
    loadNamespace,
  });
};

export const formatRichMessage = <Node = never>(
  message: string,
  locale: string,
  values?: RichMessageValues<Node>,
): RichMessageResult<Node> =>
  new IntlMessageFormat(message, locale).format<Node>(values);

export const formatMessage = (
  message: string,
  locale: string,
  values?: MessageValues,
): string => {
  const result = formatRichMessage(message, locale, values);

  if (typeof result !== "string") {
    throw new Error(
      "Rich-text messages require a rich-text formatter instead of formatMessage().",
    );
  }

  return result;
};
