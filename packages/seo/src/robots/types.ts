export type RobotsDirective =
  | "all"
  | "none"
  | "index"
  | "noindex"
  | "follow"
  | "nofollow"
  | "noarchive"
  | "nosnippet"
  | "notranslate"
  | "noimageindex";

export interface RobotsRule {
  userAgent: string | string[];
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsOptions {
  rules: RobotsRule[];
  sitemap?: string | string[];
  host?: string;
}

export interface RobotsPolicy {
  directives: RobotsDirective[];
  maxSnippet?: number;
  maxImagePreview?: "none" | "standard" | "large";
  maxVideoPreview?: number;
}

export interface RobotsResult {
  content: string;
  issues: RobotsValidationIssue[];
}

export interface RobotsValidationIssue {
  code: string;
  message: string;
  path?: string;
}
