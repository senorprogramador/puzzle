import type { SeoLocale, SeoUrl } from "../core/types";

export interface SeoTitleMetadata {
  title?: string;

  template?: string;

  default?: string;
}

export interface SeoDescriptionMetadata {
  description?: string;
}

export interface SeoCanonicalMetadata {
  canonical?: SeoUrl | string;
}

export interface SeoRobotsMetadata {
  index?: boolean;

  follow?: boolean;

  noarchive?: boolean;

  nosnippet?: boolean;

  maxSnippet?: number;

  maxImagePreview?: "none" | "standard" | "large";

  maxVideoPreview?: number;
}

export interface SeoOpenGraphMetadata {
  title?: string;

  description?: string;

  type?: string;

  url?: string;

  siteName?: string;

  locale?: string;

  images?: SeoSocialImage[];
}

export interface SeoTwitterMetadata {
  card?: "summary" | "summary_large_image";

  title?: string;

  description?: string;

  images?: string[];

  site?: string;

  creator?: string;
}

export interface SeoSocialImage {
  url: string;

  width?: number;

  height?: number;

  alt?: string;

  type?: string;
}

export interface SeoAlternateLanguage {
  locale: SeoLocale | string;

  url: SeoUrl | string;
}

export interface SeoHreflangMetadata {
  alternates: SeoAlternateLanguage[];
}

export interface SeoPageMetadata {
  title?: string;

  description?: string;

  canonical?: string;

  robots?: SeoRobotsMetadata;

  openGraph?: SeoOpenGraphMetadata;

  twitter?: SeoTwitterMetadata;

  alternates?: SeoHreflangMetadata;

  keywords?: string[];

  author?: string;

  publishedTime?: string;

  modifiedTime?: string;
}

export interface ResolvedSeoMetadata extends SeoPageMetadata {
  title: string;

  canonical: SeoUrl;

  locale: SeoLocale;
}
