import type { SeoLocale, SeoMetadata, SeoUrl } from "../core/types";

export type SeoTrailingSlash = "always" | "never" | "preserve";

export interface SeoTitleConfig {
  default?: string;
  template?: string;
  separator?: string;
}

export interface SeoDefaultMetadata {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
}

export interface SeoSiteIdentity {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export interface SeoConfig {
  siteUrl: SeoUrl | string;

  defaultLocale?: SeoLocale | string;

  supportedLocales?: Array<SeoLocale | string>;

  trailingSlash?: SeoTrailingSlash;

  title?: SeoTitleConfig;

  defaults?: SeoDefaultMetadata;

  identity?: SeoSiteIdentity;

  metadata?: SeoMetadata;

  debug?: boolean;
}

export interface SeoResolvedConfig extends Omit<SeoConfig, "siteUrl"> {
  siteUrl: SeoUrl;
  defaultLocale: SeoLocale;
  supportedLocales: SeoLocale[];
  trailingSlash: SeoTrailingSlash;
}

export interface SeoConfigOverride {
  title?: SeoTitleConfig;
  defaults?: SeoDefaultMetadata;
  metadata?: SeoMetadata;
}

export interface SeoConfigContext {
  config: SeoResolvedConfig;
  overrides?: SeoConfigOverride;
}
