import { readdirSync } from "node:fs";
import { resolve } from "node:path";

import { createLocalFontStylesheetUrl } from "./create-local-font-stylesheet-url";

const DAY = 60 * 60 * 24;
const WEEK = DAY * 7;
const YEAR = DAY * 365;

// Named after the versioned Google Fonts URL, so the content never changes.
const VERSIONED_FONT_FILE = /^font-[0-9a-f]{16}\.woff2$/;

/**
 * Stable file names, such as puzzle-fonts.css and preload fonts, change
 * content when the configuration changes. Cache them briefly and revalidate.
 */
export const FONT_STYLESHEET_CACHE_CONTROL = `public, max-age=${DAY}, stale-while-revalidate=${WEEK}`;

export const VERSIONED_FONT_CACHE_CONTROL = `public, max-age=${YEAR}, immutable`;

export type FontRouteRule = {
  headers: {
    "cache-control": string;
  };
};

export type CreateFontRouteRulesOptions = {
  /**
   * Directory the fonts were downloaded to, matching the CLI `--out-dir`.
   *
   * Defaults to "public/fonts".
   */
  outDir?: string;

  /**
   * Public URL directory the fonts are served from, matching `fontBasePath`.
   *
   * Defaults to "/fonts".
   */
  basePath?: string;

  /**
   * Directory `outDir` is resolved from. Defaults to the current directory.
   */
  cwd?: string;
};

const createRule = (cacheControl: string): FontRouteRule => ({
  headers: { "cache-control": cacheControl },
});

const readFontFiles = (directory: string): string[] => {
  try {
    return readdirSync(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
};

/**
 * Creates Nitro route rules with cache headers for fonts downloaded by
 * `puzzle-theme fonts download`.
 *
 * Versioned WOFF2 files are cached for a year as immutable. The stylesheet,
 * preload fonts, and files downloaded after the server was configured use a
 * one-day cache with background revalidation.
 */
export const createFontRouteRules = ({
  outDir = "public/fonts",
  basePath = "/fonts",
  cwd = process.cwd(),
}: CreateFontRouteRulesOptions = {}): Record<string, FontRouteRule> => {
  const stylesheetUrl = createLocalFontStylesheetUrl(basePath);
  const directoryUrl = stylesheetUrl.slice(0, stylesheetUrl.lastIndexOf("/"));

  const rules: Record<string, FontRouteRule> = {
    // A catch-all at the site root would also cache pages.
    ...(directoryUrl
      ? { [`${directoryUrl}/**`]: createRule(FONT_STYLESHEET_CACHE_CONTROL) }
      : {}),
    [stylesheetUrl]: createRule(FONT_STYLESHEET_CACHE_CONTROL),
  };

  for (const filename of readFontFiles(resolve(cwd, outDir)).sort()) {
    if (VERSIONED_FONT_FILE.test(filename)) {
      rules[`${directoryUrl}/${filename}`] = createRule(
        VERSIONED_FONT_CACHE_CONTROL,
      );
    } else if (!directoryUrl && filename.endsWith(".woff2")) {
      rules[`/${filename}`] = createRule(FONT_STYLESHEET_CACHE_CONTROL);
    }
  }

  return rules;
};
