import type { SeoUrl } from "../core/types";

export interface SitemapImage {
  url: SeoUrl | string;

  title?: string;

  caption?: string;
}

export interface SitemapAlternate {
  locale: string;

  url: SeoUrl | string;
}

export interface SitemapEntry {
  url: SeoUrl | string;

  lastModified?: Date | string;

  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";

  priority?: number;

  images?: SitemapImage[];

  alternates?: SitemapAlternate[];
}

export interface SitemapOptions {
  baseUrl: SeoUrl | string;

  entries: SitemapEntry[];

  includeLastModified?: boolean;
}
