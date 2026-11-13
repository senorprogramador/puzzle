import type { SeoUrl } from "../core/types";
import type { SeoTrailingSlash } from "../context/types";

export interface SeoUrlOptions {
  baseUrl?: string;
  trailingSlash?: SeoTrailingSlash;
  allowExternal?: boolean;
  allowCredentials?: boolean;
}

export interface SeoUrlValidationIssue {
  code: string;
  message: string;
  value?: string;
}

export interface SeoUrlResult {
  url?: SeoUrl;
  valid: boolean;
  issues: SeoUrlValidationIssue[];
}

export interface SeoOriginOptions {
  allowSubdomains?: boolean;
  protocols?: readonly ("http:" | "https:")[];
}
