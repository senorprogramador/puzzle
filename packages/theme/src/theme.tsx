import { useId, type PropsWithChildren } from "react";

import type { FontRole, FontConfig, FontSource } from "./fonts";

import type { ColorThemes, ThemeMode, ThemeTokenOverrides } from "./types";

import type { ThemeComponents } from "./components.types";

import { ThemeComponentsProvider } from "./components-context";
import { ThemeScopeProvider } from "./scope-context";

import { resolveFontStylesheets } from "./fonts/resolve-font-stylesheets";
import { createLocalFontStylesheetUrl } from "./fonts/create-local-font-stylesheet-url";
import { createFontPreloadFilename } from "./fonts/create-font-preload-filename";

import { createThemeVariables } from "./create-theme-variables";
import { createThemeCss } from "./create-theme-css";

import "./theme.css";
import "./theme-scopes.css";
import "./global.css";

export type ThemeScope = "root" | "local";

export type ThemeProps = {
  nonce?: string;
  theme?: ThemeMode;
  scope?: ThemeScope;
  globalStyles?: boolean;

  fonts?: Partial<Record<FontRole, FontConfig>> | Record<string, unknown>;

  /**
   * Determines how configured fonts are loaded.
   *
   * - google: Load stylesheets directly from Google Fonts (default).
   * - local: Load the generated stylesheet from the application's public directory.
   */
  fontSource?: FontSource;

  /**
   * Public URL directory containing puzzle-fonts.css.
   *
   * Defaults to "/fonts".
   */
  fontBasePath?: string;

  /**
   * Determines which local font is preloaded.
   *
   * - body: Preload the body font (default).
   * - heading: Preload the heading font.
   * - accent: Preload the accent font.
   * - false: Disable font preloading.
   *
   * Only applies when fontSource="local".
   */
  fontPreload?: FontRole | false;

  tokens?: ThemeTokenOverrides;
  colorTheme?: ColorThemes;
  components?: ThemeComponents;
};

const normalizeFontBasePath = (path: string): string => {
  return path.replace(/\/+$/, "");
};

const Theme = ({
  nonce,
  fonts,
  fontSource = "google",
  fontBasePath = "/fonts",
  fontPreload = "body",
  theme = "system",
  scope = "root",
  globalStyles,
  tokens,
  colorTheme,
  components,
  children,
}: PropsWithChildren<ThemeProps>) => {
  const scopeId = useId();

  const fontStylesheets = resolveFontStylesheets(fonts);

  const localFontStylesheet =
    fontSource === "local" && fontStylesheets.length > 0
      ? createLocalFontStylesheetUrl(fontBasePath)
      : null;

  const preloadFont =
    fontPreload !== false
      ? (fonts?.[fontPreload] as FontConfig | undefined)
      : undefined;

  const normalizedFontBasePath = normalizeFontBasePath(fontBasePath);

  const fontPreloadHref =
    fontSource === "local" && preloadFont?.family
      ? `${normalizedFontBasePath}/${createFontPreloadFilename(preloadFont.family)}`
      : null;

  const cssVariables = createThemeVariables(fonts, tokens, theme, colorTheme);

  const cssSelector =
    scope === "root" ? ":root" : `[data-puzzle-theme-scope="${scopeId}"]`;

  const css = `${cssSelector} {\n${createThemeCss(cssVariables)}\n}`;

  const shouldApplyGlobalStyles = scope === "root" && (globalStyles ?? true);

  const content =
    components === undefined ? (
      children
    ) : (
      <ThemeComponentsProvider components={components}>
        {children}
      </ThemeComponentsProvider>
    );

  const scopedContent = (
    <ThemeScopeProvider
      scopeId={scope === "local" ? scopeId : null}
      theme={theme}
    >
      {content}
    </ThemeScopeProvider>
  );

  const usesGoogleFonts = fontSource === "google" && fontStylesheets.length > 0;

  return (
    <>
      {fontPreloadHref ? (
        <link
          rel="preload"
          href={fontPreloadHref}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ) : null}

      {usesGoogleFonts ? (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />

          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </>
      ) : null}

      {fontSource === "google"
        ? fontStylesheets.map(({ href }) => (
            <link
              key={href}
              rel="stylesheet"
              href={href}
              precedence="default"
            />
          ))
        : null}

      {localFontStylesheet ? (
        <link
          key={localFontStylesheet}
          rel="stylesheet"
          href={localFontStylesheet}
          precedence="default"
        />
      ) : null}

      {shouldApplyGlobalStyles ? (
        <style nonce={nonce} data-puzzle-global-styles="" />
      ) : null}

      <style
        nonce={nonce}
        data-theme={theme}
        data-puzzle-theme={scope === "root" ? "true" : undefined}
        data-puzzle-theme-scope-style={scope === "local" ? scopeId : undefined}
      >
        {css}
      </style>

      {scopedContent}
    </>
  );
};

export { Theme };
