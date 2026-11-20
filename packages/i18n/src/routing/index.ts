import type { LocaleRegistry } from "../locale";

const INTERNAL_ORIGIN = "https://puzzle-i18n.invalid";
const MALFORMED_ESCAPE = /%(?![\da-f]{2})/i;
const ENCODED_PATH_SEPARATOR = /%(?:2f|5c)/i;
const CONTROL_CHARACTER = /[\u0000-\u001f\u007f]/;
const PARAMETER_SEGMENT = /^:([A-Za-z][A-Za-z0-9_]*)$/;

export interface LocalizedRouteMatch {
  locale: string;
  pathname: string;
  search: string;
  hash: string;
  matchedPrefix: boolean;
}

export interface LocalizedRoutePathDefinition {
  path: string;
  aliases?: readonly string[];
}

export type LocalizedRoutePath =
  | string
  | LocalizedRoutePathDefinition;

export type LocalizedRouteMap = Readonly<
  Record<string, Readonly<Record<string, LocalizedRoutePath>>>
>;

export interface LocalizedRoutingOptions<
  Routes extends LocalizedRouteMap = LocalizedRouteMap,
> {
  registry: LocaleRegistry;
  prefixDefaultLocale?: boolean;
  basePath?: string;
  routes?: Routes;
  origins?: Readonly<Record<string, string>>;
}

export interface LocalizedRouteOutputOptions {
  search?: string;
  hash?: string;
}

export interface MatchedLocalizedRoute<
  RouteId extends string = string,
> extends LocalizedRouteMatch {
  routeId: RouteId;
  params: Readonly<Record<string, string>>;
  isAlias: boolean;
  canonicalPath: string;
  redirectTo?: string;
}

type RouteIds<Routes extends LocalizedRouteMap> = Extract<
  keyof Routes,
  string
>;
type RouteLocales<
  Routes extends LocalizedRouteMap,
  RouteId extends RouteIds<Routes>,
> = Extract<keyof Routes[RouteId], string>;

export interface LocalizedRouting<
  Routes extends LocalizedRouteMap = LocalizedRouteMap,
> {
  match(path: string): LocalizedRouteMatch;
  localize(path: string, locale: string): string;
  alternatePaths(path: string): Readonly<Record<string, string>>;
  matchRoute(path: string): MatchedLocalizedRoute<RouteIds<Routes>> | undefined;
  localizeRoute<RouteId extends RouteIds<Routes>>(
    routeId: RouteId,
    locale: RouteLocales<Routes, RouteId>,
    params?: Readonly<Record<string, string | number>>,
    options?: LocalizedRouteOutputOptions,
  ): string;
  alternateRoutePaths<RouteId extends RouteIds<Routes>>(
    routeId: RouteId,
    params?: Readonly<Record<string, string | number>>,
    options?: LocalizedRouteOutputOptions,
  ): Readonly<Record<string, string>>;
}

interface ParsedPath {
  url: URL;
  originLocale?: string;
}

interface LocalePathMatch {
  locale: string;
  pathname: string;
  search: string;
  hash: string;
  matchedPrefix: boolean;
}

interface CompiledPattern {
  path: string;
  segments: readonly RouteSegment[];
  parameterNames: readonly string[];
}

type RouteSegment =
  | { kind: "literal"; value: string }
  | { kind: "parameter"; name: string };

interface CompiledRouteLocale {
  canonical: CompiledPattern;
  aliases: readonly CompiledPattern[];
}

interface CompiledRouteMatch {
  routeId: string;
  localeMatch: LocalePathMatch;
  parsed: ParsedPath;
  params: Readonly<Record<string, string>>;
  sourcePattern: CompiledPattern;
  canonicalPattern: CompiledPattern;
  isAlias: boolean;
}

type RuntimeRouteMap = Readonly<
  Record<string, Readonly<Record<string, LocalizedRoutePath>>>
>;

const invalidPath = (): Error =>
  new Error(
    "Localized routes must be safe, same-origin absolute paths or configured locale origins.",
  );

const validatePercentEscapes = (value: string): void => {
  if (MALFORMED_ESCAPE.test(value)) {
    throw invalidPath();
  }
};

const validatePathname = (pathname: string): void => {
  if (
    !pathname.startsWith("/") ||
    pathname.startsWith("//") ||
    pathname.includes("//") ||
    pathname.includes("\\") ||
    CONTROL_CHARACTER.test(pathname) ||
    ENCODED_PATH_SEPARATOR.test(pathname)
  ) {
    throw invalidPath();
  }

  validatePercentEscapes(pathname);

  for (const segment of pathname.split("/")) {
    let decoded: string;

    try {
      decoded = decodeURIComponent(segment);
    } catch {
      throw invalidPath();
    }

    const validateDecodedSegment = (value: string): void => {
      if (
        value === "." ||
        value === ".." ||
        value.includes("/") ||
        value.includes("\\") ||
        CONTROL_CHARACTER.test(value)
      ) {
        throw invalidPath();
      }
    };

    validateDecodedSegment(decoded);

    for (let depth = 0; depth < 8; depth += 1) {
      if (!/%[\da-f]{2}/i.test(decoded)) {
        break;
      }

      let nested: string;

      try {
        nested = decodeURIComponent(decoded);
      } catch {
        break;
      }

      if (nested === decoded) {
        break;
      }

      validateDecodedSegment(nested);
      decoded = nested;
    }

    if (/%[\da-f]{2}/i.test(decoded)) {
      throw invalidPath();
    }
  }
};

const normalizeBasePath = (value: string | undefined): string => {
  if (value === undefined || value === "" || value === "/") {
    return "";
  }

  if (value.includes("?") || value.includes("#") || /\/{2,}/.test(value)) {
    throw new Error("Localized routing basePath must be a safe pathname.");
  }

  validatePathname(value);
  return value.replace(/\/+$/, "");
};

const stripBasePath = (pathname: string, basePath: string): string => {
  if (!basePath) {
    return pathname;
  }

  if (pathname === basePath) {
    return "/";
  }

  if (!pathname.startsWith(`${basePath}/`)) {
    throw new Error(
      `Localized route path must be within the configured basePath "${basePath}".`,
    );
  }

  return pathname.slice(basePath.length);
};

const rawPathname = (input: string, isAbsoluteUrl: boolean): string => {
  if (!isAbsoluteUrl) {
    return input.split(/[?#]/, 1)[0] ?? "/";
  }

  const schemeEnd = input.indexOf("://") + 3;
  const authorityEndOffset = input.slice(schemeEnd).search(/[/?#]/);
  const authorityEnd =
    authorityEndOffset === -1
      ? input.length
      : schemeEnd + authorityEndOffset;
  const suffix = input.slice(authorityEnd);

  if (!suffix.startsWith("/")) {
    return "/";
  }

  return suffix.split(/[?#]/, 1)[0] ?? "/";
};

const parseInternalPath = (
  path: string,
  originsByOrigin: ReadonlyMap<string, string>,
): ParsedPath => {
  if (typeof path !== "string") {
    throw invalidPath();
  }

  const absoluteUrl = /^https?:\/\//i.test(path);

  if (
    CONTROL_CHARACTER.test(path) ||
    path.includes("\\") ||
    (!absoluteUrl && (!path.startsWith("/") || path.startsWith("//")))
  ) {
    throw invalidPath();
  }

  validatePercentEscapes(path);
  validatePathname(rawPathname(path, absoluteUrl));

  let url: URL;

  try {
    url = new URL(path, INTERNAL_ORIGIN);
  } catch {
    throw invalidPath();
  }

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    url.username ||
    url.password
  ) {
    throw invalidPath();
  }

  const originLocale = originsByOrigin.get(url.origin);

  if (
    absoluteUrl &&
    (url.origin === INTERNAL_ORIGIN || !originLocale)
  ) {
    if (originsByOrigin.size === 0) {
      throw invalidPath();
    }

    throw new Error("Localized routes must not contain an external origin.");
  }

  return { url, originLocale };
};

const normalizeOrigin = (value: string): string => {
  if (
    value.includes("\\") ||
    !/^https?:\/\/[^/?#]+\/?$/i.test(value)
  ) {
    throw new Error(
      "Locale origins must be bare HTTP(S) origins without credentials, paths, queries, or hashes.",
    );
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid locale origin "${value}".`);
  }

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    url.username ||
    url.password ||
    url.origin === INTERNAL_ORIGIN
  ) {
    throw new Error(`Invalid locale origin "${value}".`);
  }

  return url.origin;
};

const compilePattern = (path: string): CompiledPattern => {
  if (
    path.includes("?") ||
    path.includes("#") ||
    CONTROL_CHARACTER.test(path)
  ) {
    throw new Error("Localized route patterns must contain only a pathname.");
  }

  validatePathname(path);

  const parameterNames: string[] = [];
  const segments = path.split("/").map((segment): RouteSegment => {
    const parameter = PARAMETER_SEGMENT.exec(segment);

    if (!parameter) {
      if (segment.startsWith(":")) {
        throw new Error(`Invalid route parameter segment "${segment}".`);
      }

      return {
        kind: "literal",
        value: decodeURIComponent(segment),
      };
    }

    const name = parameter[1];

    if (!name || parameterNames.includes(name)) {
      throw new Error(`Invalid or duplicate route parameter "${name}".`);
    }

    parameterNames.push(name);
    return { kind: "parameter", name };
  });

  return {
    path,
    segments,
    parameterNames: Object.freeze(parameterNames),
  };
};

const patternKey = (pattern: CompiledPattern): string =>
  JSON.stringify(
    pattern.segments.map((segment) =>
      segment.kind === "parameter" ? ":" : segment.value,
    ),
  );

const routePathParts = (
  value: LocalizedRoutePath,
): { path: string; aliases: readonly string[] } => {
  if (typeof value === "string") {
    return { path: value, aliases: [] };
  }

  if (
    !value ||
    typeof value !== "object" ||
    typeof value.path !== "string" ||
    (value.aliases !== undefined &&
      (!Array.isArray(value.aliases) ||
        value.aliases.some((alias) => typeof alias !== "string")))
  ) {
    throw new Error("Localized route definitions must provide a path.");
  }

  return {
    path: value.path,
    aliases: value.aliases ?? [],
  };
};

const compileRoutes = (
  routes: RuntimeRouteMap,
  registry: LocaleRegistry,
): ReadonlyMap<string, ReadonlyMap<string, CompiledRouteLocale>> => {
  const result = new Map<string, ReadonlyMap<string, CompiledRouteLocale>>();
  const pathsByLocale = new Map<string, Map<string, string>>();

  for (const definition of registry.locales) {
    pathsByLocale.set(definition.locale, new Map());
  }

  for (const [routeId, route] of Object.entries(routes)) {
    if (!routeId || !route || typeof route !== "object") {
      throw new Error("Localized route maps must use non-empty route IDs.");
    }

    const locales = new Map<string, CompiledRouteLocale>();

    for (const [inputLocale, value] of Object.entries(route)) {
      const locale = registry.resolve(inputLocale);

      if (!locale) {
        throw new Error(
          `Route "${routeId}" uses unsupported locale "${inputLocale}".`,
        );
      }

      if (locales.has(locale)) {
        throw new Error(
          `Route "${routeId}" defines locale "${locale}" more than once.`,
        );
      }

      const { path, aliases } = routePathParts(value);
      const canonical = compilePattern(path);
      const compiledAliases = aliases.map(compilePattern);

      for (const alias of compiledAliases) {
        if (alias.parameterNames.length !== canonical.parameterNames.length) {
          throw new Error(
            `Route aliases for "${routeId}" must use the same number of parameters as the canonical path.`,
          );
        }
      }

      const patterns = [canonical, ...compiledAliases];
      const localePaths = pathsByLocale.get(locale);

      if (!localePaths) {
        throw new Error(`Unsupported route locale "${locale}".`);
      }

      for (const pattern of patterns) {
        const key = patternKey(pattern);
        const existing = localePaths.get(key);

        if (existing) {
          throw new Error(
            `Route path "${pattern.path}" is ambiguous between "${existing}" and "${routeId}" for locale "${locale}".`,
          );
        }

        localePaths.set(key, routeId);
      }

      locales.set(
        locale,
        Object.freeze({
          canonical,
          aliases: Object.freeze(compiledAliases),
        }),
      );
    }

    for (const definition of registry.locales) {
      if (!locales.has(definition.locale)) {
        throw new Error(
          `Route "${routeId}" is missing a path for locale "${definition.locale}".`,
        );
      }
    }

    const defaultRoute = locales.get(registry.defaultLocale);

    if (
      defaultRoute &&
      [...locales.values()].some(
        (localeRoute) =>
          localeRoute.canonical.parameterNames.length !==
          defaultRoute.canonical.parameterNames.length,
      )
    ) {
      throw new Error(
        `Route "${routeId}" must use the same number of parameters for every locale.`,
      );
    }

    result.set(routeId, locales);
  }

  return result;
};

const localePathMatch = (
  parsed: ParsedPath,
  registry: LocaleRegistry,
  basePath: string,
): LocalePathMatch => {
  const mountedPathname = stripBasePath(parsed.url.pathname, basePath);
  const segments = mountedPathname.split("/");
  let pathLocale: string | undefined;

  try {
    pathLocale = segments[1]
      ? registry.resolve(decodeURIComponent(segments[1]))
      : undefined;
  } catch {
    pathLocale = undefined;
  }

  if (pathLocale) {
    segments.splice(1, 1);
  }

  if (
    pathLocale &&
    parsed.originLocale &&
    pathLocale !== parsed.originLocale
  ) {
    throw new Error(
      "The locale path prefix does not match the configured locale origin.",
    );
  }

  const pathname = segments.join("/") || "/";

  if (pathname.startsWith("//")) {
    throw invalidPath();
  }

  return {
    locale: pathLocale ?? parsed.originLocale ?? registry.defaultLocale,
    pathname: pathname.startsWith("/") ? pathname : `/${pathname}`,
    search: parsed.url.search,
    hash: parsed.url.hash,
    matchedPrefix: pathLocale !== undefined,
  };
};

const matchPattern = (
  pattern: CompiledPattern,
  pathname: string,
): Readonly<Record<string, string>> | undefined => {
  const pathSegments = pathname.split("/");

  if (pathSegments.length !== pattern.segments.length) {
    return undefined;
  }

  const params: Record<string, string> = {};

  for (const [index, segment] of pattern.segments.entries()) {
    const pathSegment = pathSegments[index];

    if (pathSegment === undefined) {
      return undefined;
    }

    let decoded: string;

    try {
      decoded = decodeURIComponent(pathSegment);
    } catch {
      return undefined;
    }

    if (segment.kind === "literal") {
      if (decoded !== segment.value) {
        return undefined;
      }
    } else {
      if (decoded.length === 0) {
        return undefined;
      }

      params[segment.name] = decoded;
    }
  }

  return Object.freeze(params);
};

const remapParameters = (
  source: CompiledPattern,
  params: Readonly<Record<string, string>>,
  target: CompiledPattern,
): Readonly<Record<string, string>> => {
  const result: Record<string, string> = {};

  for (const [index, name] of target.parameterNames.entries()) {
    const sourceName = source.parameterNames[index];
    const value = sourceName ? params[sourceName] : undefined;

    if (value === undefined) {
      throw new Error(`Missing route parameter "${sourceName ?? name}".`);
    }

    result[name] = value;
  }

  return result;
};

const normalizeSuffix = (
  options: LocalizedRouteOutputOptions = {},
): { search: string; hash: string } => {
  const search = options.search ?? "";
  const hash = options.hash ?? "";

  if (
    (search && !search.startsWith("?")) ||
    search.includes("#") ||
    (hash && !hash.startsWith("#")) ||
    hash.includes("?") ||
    CONTROL_CHARACTER.test(search) ||
    CONTROL_CHARACTER.test(hash)
  ) {
    throw new Error("Route search and hash values must be safe URL suffixes.");
  }

  validatePercentEscapes(search);
  validatePercentEscapes(hash);
  return { search, hash };
};

const fillPattern = (
  pattern: CompiledPattern,
  params: Readonly<Record<string, string | number>> = {},
): string => {
  const expected = new Set(pattern.parameterNames);

  for (const key of Object.keys(params)) {
    if (!expected.has(key)) {
      throw new Error(`Unknown route parameter "${key}".`);
    }
  }

  const path = pattern.segments
    .map((segment) => {
      if (segment.kind === "literal") {
        return encodeURIComponent(segment.value).replace(/%2F/gi, "/");
      }

      const value = params[segment.name];

      if (
        (typeof value !== "string" && typeof value !== "number") ||
        !Number.isFinite(typeof value === "number" ? value : 0)
      ) {
        throw new Error(`Missing route parameter "${segment.name}".`);
      }

      const normalized = String(value);

      if (
        normalized.length === 0 ||
        normalized === "." ||
        normalized === ".." ||
        normalized.includes("/") ||
        normalized.includes("\\") ||
        CONTROL_CHARACTER.test(normalized)
      ) {
        throw new Error(`Unsafe value for route parameter "${segment.name}".`);
      }

      try {
        const encoded = encodeURIComponent(normalized);
        validatePathname(`/${encoded}`);
        return encoded;
      } catch {
        throw new Error(`Unsafe value for route parameter "${segment.name}".`);
      }
    })
    .join("/");

  return path || "/";
};

export const createLocalizedRouting = <
  const Routes extends LocalizedRouteMap = LocalizedRouteMap,
>(
  options: LocalizedRoutingOptions<Routes>,
): LocalizedRouting<Routes> => {
  const { registry } = options;
  const prefixDefaultLocale = options.prefixDefaultLocale ?? false;
  const basePath = normalizeBasePath(options.basePath);
  const originsByLocale = new Map<string, string>();
  const originsByOrigin = new Map<string, string>();

  for (const [inputLocale, originInput] of Object.entries(options.origins ?? {})) {
    const locale = registry.resolve(inputLocale);

    if (!locale) {
      throw new Error(`Unsupported origin locale "${inputLocale}".`);
    }

    if (originsByLocale.has(locale)) {
      throw new Error(`Origin for locale "${locale}" is defined more than once.`);
    }

    const origin = normalizeOrigin(originInput);
    const existingLocale = originsByOrigin.get(origin);

    if (existingLocale) {
      throw new Error(
        `Origin "${origin}" is shared by locales "${existingLocale}" and "${locale}".`,
      );
    }

    originsByLocale.set(locale, origin);
    originsByOrigin.set(origin, locale);
  }

  const routes = compileRoutes(
    (options.routes ?? {}) as RuntimeRouteMap,
    registry,
  );

  const parse = (path: string): ParsedPath =>
    parseInternalPath(path, originsByOrigin);

  const match = (path: string): LocalizedRouteMatch =>
    localePathMatch(parse(path), registry, basePath);

  const buildLocalizedPath = (
    pathname: string,
    search: string,
    hash: string,
    locale: string,
  ): string => {
    const origin = originsByLocale.get(locale);
    const shouldPrefix =
      !origin && (locale !== registry.defaultLocale || prefixDefaultLocale);
    const localizedPath =
      pathname === "/"
        ? shouldPrefix
          ? `/${locale}`
          : "/"
        : shouldPrefix
          ? `/${locale}${pathname}`
          : pathname;
    const rootedPath = basePath
      ? `${basePath}${localizedPath === "/" ? "" : localizedPath}`
      : localizedPath;
    const pathWithSuffix = `${rootedPath || "/"}${search}${hash}`;

    return origin ? `${origin}${pathWithSuffix}` : pathWithSuffix;
  };

  const getRouteMatch = (path: string): CompiledRouteMatch | undefined => {
    const parsed = parse(path);
    const localeMatch = localePathMatch(parsed, registry, basePath);

    for (const [routeId, routeLocales] of routes) {
      const route = routeLocales.get(localeMatch.locale);

      if (!route) {
        continue;
      }

      const canonicalParams = matchPattern(
        route.canonical,
        localeMatch.pathname,
      );

      if (canonicalParams) {
        return {
          routeId,
          localeMatch,
          parsed,
          params: canonicalParams,
          sourcePattern: route.canonical,
          canonicalPattern: route.canonical,
          isAlias: false,
        };
      }

      for (const alias of route.aliases) {
        const params = matchPattern(alias, localeMatch.pathname);

        if (params) {
          return {
            routeId,
            localeMatch,
            parsed,
            params,
            sourcePattern: alias,
            canonicalPattern: route.canonical,
            isAlias: true,
          };
        }
      }
    }

    return undefined;
  };

  const localizeRoute = <
    RouteId extends RouteIds<Routes>,
  >(
    routeId: RouteId,
    inputLocale: RouteLocales<Routes, RouteId>,
    params: Readonly<Record<string, string | number>> = {},
    outputOptions: LocalizedRouteOutputOptions = {},
  ): string => {
    const locale = registry.resolve(inputLocale);

    if (!locale) {
      throw new Error(`Unsupported locale "${inputLocale}".`);
    }

    const route = routes.get(routeId);
    const localeRoute = route?.get(locale);

    if (!localeRoute) {
      throw new Error(
        `Route "${routeId}" has no path for locale "${locale}".`,
      );
    }

    const suffix = normalizeSuffix(outputOptions);
    const pathname = fillPattern(localeRoute.canonical, params);

    return buildLocalizedPath(pathname, suffix.search, suffix.hash, locale);
  };

  const localize = (path: string, inputLocale: string): string => {
    const locale = registry.resolve(inputLocale);

    if (!locale) {
      throw new Error(`Unsupported locale "${inputLocale}".`);
    }

    const routeMatch = getRouteMatch(path);

    if (routeMatch) {
      const target = routes.get(routeMatch.routeId)?.get(locale);

      if (!target) {
        throw new Error(
          `Route "${routeMatch.routeId}" has no path for locale "${locale}".`,
        );
      }

      const params = remapParameters(
        routeMatch.sourcePattern,
        routeMatch.params,
        target.canonical,
      );

      return localizeRoute(
        routeMatch.routeId as RouteIds<Routes>,
        locale as RouteLocales<Routes, RouteIds<Routes>>,
        params,
        {
          search: routeMatch.localeMatch.search,
          hash: routeMatch.localeMatch.hash,
        },
      );
    }

    const current = match(path);
    return buildLocalizedPath(
      current.pathname,
      current.search,
      current.hash,
      locale,
    );
  };

  const alternatePaths = (
    path: string,
  ): Readonly<Record<string, string>> => {
    const result: Record<string, string> = {};

    for (const locale of registry.locales) {
      result[locale.locale] = localize(path, locale.locale);
    }

    return result;
  };

  const matchRoute = (
    path: string,
  ): MatchedLocalizedRoute<RouteIds<Routes>> | undefined => {
    const routeMatch = getRouteMatch(path);

    if (!routeMatch) {
      return undefined;
    }

    const canonicalParams = remapParameters(
      routeMatch.sourcePattern,
      routeMatch.params,
      routeMatch.canonicalPattern,
    );
    const canonicalPath = buildLocalizedPath(
      fillPattern(routeMatch.canonicalPattern, canonicalParams),
      routeMatch.localeMatch.search,
      routeMatch.localeMatch.hash,
      routeMatch.localeMatch.locale,
    );
    const originalPath = routeMatch.parsed.url.origin === INTERNAL_ORIGIN
      ? `${routeMatch.parsed.url.pathname}${routeMatch.parsed.url.search}${routeMatch.parsed.url.hash}`
      : `${routeMatch.parsed.url.origin}${routeMatch.parsed.url.pathname}${routeMatch.parsed.url.search}${routeMatch.parsed.url.hash}`;
    const redirectTo =
      routeMatch.isAlias || canonicalPath !== originalPath
        ? canonicalPath
        : undefined;

    return {
      ...routeMatch.localeMatch,
      routeId: routeMatch.routeId as RouteIds<Routes>,
      params: routeMatch.params,
      isAlias: routeMatch.isAlias,
      canonicalPath,
      ...(redirectTo ? { redirectTo } : {}),
    };
  };

  const alternateRoutePaths = <RouteId extends RouteIds<Routes>>(
    routeId: RouteId,
    params: Readonly<Record<string, string | number>> = {},
    outputOptions: LocalizedRouteOutputOptions = {},
  ): Readonly<Record<string, string>> => {
    const result: Record<string, string> = {};
    const sourceRoute = routes.get(routeId)?.get(registry.defaultLocale);

    for (const locale of registry.locales) {
      const targetRoute = routes.get(routeId)?.get(locale.locale);

      if (!sourceRoute || !targetRoute) {
        throw new Error(
          `Route "${routeId}" has no path for locale "${locale.locale}".`,
        );
      }

      const sourceParams: Record<string, string> = {};

      for (const [key, value] of Object.entries(params)) {
        if (!sourceRoute.canonical.parameterNames.includes(key)) {
          throw new Error(`Unknown route parameter "${key}".`);
        }

        if (typeof value === "number" && !Number.isFinite(value)) {
          throw new Error(`Invalid value for route parameter "${key}".`);
        }

        sourceParams[key] = String(value);
      }

      const localizedParams = remapParameters(
        sourceRoute.canonical,
        sourceParams,
        targetRoute.canonical,
      );

      result[locale.locale] = localizeRoute(
        routeId,
        locale.locale as RouteLocales<Routes, RouteId>,
        localizedParams,
        outputOptions,
      );
    }

    return Object.freeze(result);
  };

  return Object.freeze({
    match,
    localize,
    alternatePaths,
    matchRoute,
    localizeRoute,
    alternateRoutePaths,
  });
};
