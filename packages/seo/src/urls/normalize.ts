import type { SeoUrl } from "../core/types";
import type { SeoTrailingSlash } from "../context/types";

export interface NormalizeSeoUrlOptions {
  baseUrl?: string;
  trailingSlash?: SeoTrailingSlash;
  allowExternal?: boolean;
  allowCredentials?: boolean;
}

export const normalizeSeoPath = (
  pathname: string,
  trailingSlash: SeoTrailingSlash = "never",
): string => {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (path === "/") {
    return "/";
  }

  if (trailingSlash === "always") {
    return `${path.replace(/\/+$/, "")}/`;
  }

  if (trailingSlash === "never") {
    return path.replace(/\/+$/, "");
  }

  return path;
};

export const normalizeSeoUrl = (
  value: string,
  options: NormalizeSeoUrlOptions = {},
): SeoUrl => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("SEO URL must be a non-empty string.");
  }

  const baseUrl = options.baseUrl ?? "https://example.com";

  let url: URL;
  let base: URL;

  try {
    base = new URL(baseUrl);
    url = new URL(value, base);
  } catch {
    throw new Error(`Invalid SEO URL: "${value}".`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SEO URLs must use HTTP or HTTPS.");
  }

  if (url.username || url.password) {
    if (!options.allowCredentials) {
      throw new Error("SEO URLs must not contain credentials.");
    }
  }

  if (options.allowExternal === false && url.origin !== base.origin) {
    throw new Error("External SEO URLs are not allowed.");
  }

  url.pathname = normalizeSeoPath(
    url.pathname,
    options.trailingSlash ?? "never",
  );

  return url.toString() as SeoUrl;
};

export const normalizeSeoOrigin = (value: string): SeoUrl => {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid SEO origin: "${value}".`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SEO origins must use HTTP or HTTPS.");
  }

  if (url.username || url.password) {
    throw new Error("SEO origins must not contain credentials.");
  }

  return url.origin as SeoUrl;
};

export const isSameSeoOrigin = (first: string, second: string): boolean => {
  try {
    return new URL(first).origin === new URL(second).origin;
  } catch {
    return false;
  }
};

export const isValidSeoUrl = (value: string, baseUrl?: string): boolean => {
  try {
    normalizeSeoUrl(value, { baseUrl });
    return true;
  } catch {
    return false;
  }
};

export const resolveSeoUrls = (
  values: readonly string[],
  options: NormalizeSeoUrlOptions = {},
): SeoUrl[] => {
  const resolved = values.map((value) => normalizeSeoUrl(value, options));

  return [...new Set(resolved)].sort((a, b) => a.localeCompare(b));
};
