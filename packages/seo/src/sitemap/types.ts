import type { SeoUrl } from "../core/types";

export interface SitemapImage {
  url: SeoUrl | string;
  title?: string;
  caption?: string;
}

export interface SitemapVideo {
  thumbnailUrl: string;
  title: string;
  description: string;
  contentUrl?: string;
  playerUrl?: string;
  duration?: number;
  expirationDate?: Date | string;
  rating?: number;
  viewCount?: number;
  publicationDate?: Date | string;
  familyFriendly?: boolean;
  restriction?: {
    relationship: "allow" | "deny";
    countries: string[];
  };
  requiresSubscription?: boolean;
  live?: boolean;
  tags?: string[];
  category?: string;
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
  videos?: SitemapVideo[];
  alternates?: SitemapAlternate[];

  /** Excludes the entry when false. */
  indexable?: boolean;

  /** Only HTTP 200 entries are included. */
  statusCode?: number;

  /** Excludes redirect entries. */
  redirectTo?: string;
}

export interface SitemapOptions {
  baseUrl: SeoUrl | string;
  entries: SitemapEntry[];
  includeLastModified?: boolean;
  allowExternalUrls?: boolean;
}

export interface SitemapGenerationOptions extends SitemapOptions {
  maxEntries?: number;
  maxBytes?: number;
  filename?: string;
  validateAlternates?: boolean;
}

export interface SitemapValidationIssue {
  code: string;
  message: string;
  url?: string;
  path?: string;
}

export interface SitemapResult {
  xml: string;
  entries: SitemapEntry[];
  issues: SitemapValidationIssue[];
}

export interface SitemapFile {
  filename: string;
  url: SeoUrl;
  xml: string;
  entries: SitemapEntry[];
}

export interface SitemapCollection {
  files: SitemapFile[];
  indexXml?: string;
  indexUrl?: SeoUrl;
  totalEntries: number;
  issues: SitemapValidationIssue[];
}
