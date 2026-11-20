export interface LocaleDefinition {
  locale: string;
  name?: string;
  nativeName?: string;
  direction?: "ltr" | "rtl";
  aliases?: readonly string[];
  fallbacks?: readonly string[];
}

export interface LocaleRegistryOptions {
  locales: readonly LocaleDefinition[];
  defaultLocale: string;
  fallbackLocale?: string;
}

export interface LocaleRegistry {
  readonly locales: readonly LocaleDefinition[];
  readonly defaultLocale: string;
  readonly fallbackLocale: string;
  canonicalize(locale: string): string;
  get(locale: string): LocaleDefinition | undefined;
  isSupported(locale: string): boolean;
  resolve(locale: string): string | undefined;
  fallbackChain(locale: string): readonly string[];
}

export class InvalidLocaleError extends Error {
  constructor(locale: string) {
    super(`Invalid BCP 47 locale: "${locale}".`);
    this.name = "InvalidLocaleError";
  }
}

const canonicalize = (locale: string): string => {
  try {
    const [canonical] = Intl.getCanonicalLocales(locale);

    if (!canonical) {
      throw new InvalidLocaleError(locale);
    }

    return canonical;
  } catch {
    throw new InvalidLocaleError(locale);
  }
};

const localeKey = (locale: string): string => locale.toLowerCase();

export const isValidLocale = (locale: string): boolean => {
  try {
    canonicalize(locale);
    return true;
  } catch {
    return false;
  }
};

export const createLocaleRegistry = (
  options: LocaleRegistryOptions,
): LocaleRegistry => {
  if (options.locales.length === 0) {
    throw new Error("At least one supported locale is required.");
  }

  const definitions = new Map<string, LocaleDefinition>();
  const aliases = new Map<string, string>();

  for (const definition of options.locales) {
    const locale = canonicalize(definition.locale);

    if (definitions.has(locale)) {
      throw new Error(`Duplicate locale definition: "${locale}".`);
    }

    const normalized: LocaleDefinition = Object.freeze({
      ...definition,
      locale,
      aliases: definition.aliases
        ? Object.freeze([...definition.aliases])
        : undefined,
      fallbacks: definition.fallbacks
        ? Object.freeze(definition.fallbacks.map(canonicalize))
        : undefined,
    });

    definitions.set(locale, normalized);

    for (const alias of definition.aliases ?? []) {
      const key = localeKey(canonicalize(alias));
      const existing = aliases.get(key);

      if (existing && existing !== locale) {
        throw new Error(
          `Locale alias "${alias}" is assigned to multiple locales.`,
        );
      }

      aliases.set(key, locale);
    }
  }

  for (const [alias, locale] of aliases) {
    const supportedLocale = [...definitions.keys()].find(
      (candidate) => localeKey(candidate) === alias,
    );

    if (supportedLocale && supportedLocale !== locale) {
      throw new Error(
        `Locale alias "${alias}" conflicts with supported locale "${supportedLocale}".`,
      );
    }
  }

  for (const definition of definitions.values()) {
    for (const fallback of definition.fallbacks ?? []) {
      if (!definitions.has(fallback)) {
        throw new Error(
          `Fallback locale "${fallback}" from "${definition.locale}" is not supported.`,
        );
      }
    }
  }

  const defaultLocale = canonicalize(options.defaultLocale);
  const fallbackLocale = canonicalize(
    options.fallbackLocale ?? options.defaultLocale,
  );

  if (!definitions.has(defaultLocale)) {
    throw new Error(
      `Default locale "${defaultLocale}" is not present in the locale registry.`,
    );
  }

  if (!definitions.has(fallbackLocale)) {
    throw new Error(
      `Fallback locale "${fallbackLocale}" is not present in the locale registry.`,
    );
  }

  const resolve = (input: string): string | undefined => {
    let locale: string;

    try {
      locale = canonicalize(input);
    } catch {
      return undefined;
    }

    const alias = aliases.get(localeKey(locale));

    if (alias) {
      return alias;
    }

    if (definitions.has(locale)) {
      return locale;
    }

    const language = locale.split("-")[0];

    if (language && definitions.has(language)) {
      return language;
    }

    const languageMatches = [...definitions.keys()].filter(
      (candidate) => candidate.split("-")[0] === language,
    );

    if (languageMatches.length === 1) {
      return languageMatches[0];
    }

    return undefined;
  };

  const fallbackChain = (input: string): readonly string[] => {
    const resolved = resolve(input);

    if (!resolved) {
      throw new InvalidLocaleError(input);
    }

    const chain: string[] = [];
    const visited = new Set<string>();

    const add = (locale: string): void => {
      if (visited.has(locale) || !definitions.has(locale)) {
        return;
      }

      visited.add(locale);
      chain.push(locale);

      const definition = definitions.get(locale);

      for (const fallback of definition?.fallbacks ?? []) {
        add(fallback);
      }

      const language = locale.split("-")[0];

      if (language && language !== locale && definitions.has(language)) {
        add(language);
      }
    };

    add(resolved);
    add(fallbackLocale);
    add(defaultLocale);

    return Object.freeze(chain);
  };

  return Object.freeze({
    locales: Object.freeze([...definitions.values()]),
    defaultLocale,
    fallbackLocale,
    canonicalize,
    get: (input: string) => {
      const resolved = resolve(input);
      return resolved ? definitions.get(resolved) : undefined;
    },
    isSupported: (input: string) => resolve(input) !== undefined,
    resolve,
    fallbackChain,
  });
};

export interface LocaleResolutionInput {
  registry: LocaleRegistry;
  explicit?: string;
  urlLocale?: string;
  userPreference?: string;
  cookie?: string;
  acceptLanguage?: string;
  browserLocale?: string;
}

export interface LocaleResolution {
  locale: string;
  source:
    | "explicit"
    | "url"
    | "user-preference"
    | "cookie"
    | "accept-language"
    | "browser"
    | "default";
}

const acceptedLanguages = (header: string): string[] =>
  header
    .split(",")
    .map((part, index) => {
      const [tag, ...parameters] = part.trim().split(";");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith("q="),
      );
      const quality = qualityParameter
        ? Number(qualityParameter.trim().slice(2))
        : 1;

      return {
        tag: tag?.trim(),
        quality,
        index,
      };
    })
    .filter(
      (
        entry,
      ): entry is { tag: string; quality: number; index: number } =>
        Boolean(entry.tag) &&
        Number.isFinite(entry.quality) &&
        entry.quality > 0 &&
        entry.quality <= 1,
    )
    .sort((left, right) => right.quality - left.quality || left.index - right.index)
    .map((entry) => entry.tag);

export const resolveLocale = (
  input: LocaleResolutionInput,
): LocaleResolution => {
  const candidates: Array<{
    locale: string | undefined;
    source: LocaleResolution["source"];
  }> = [
    { locale: input.explicit, source: "explicit" },
    { locale: input.urlLocale, source: "url" },
    { locale: input.userPreference, source: "user-preference" },
    { locale: input.cookie, source: "cookie" },
    ...acceptedLanguages(input.acceptLanguage ?? "").map((locale) => ({
      locale,
      source: "accept-language" as const,
    })),
    { locale: input.browserLocale, source: "browser" },
  ];

  for (const candidate of candidates) {
    const locale = candidate.locale
      ? input.registry.resolve(candidate.locale)
      : undefined;

    if (locale) {
      return { locale, source: candidate.source };
    }
  }

  return { locale: input.registry.defaultLocale, source: "default" };
};
