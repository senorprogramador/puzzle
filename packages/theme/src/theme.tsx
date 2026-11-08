import { useId, type PropsWithChildren } from "react";

import type { FontRole, FontConfig } from "./fonts";
import type { ColorThemes, ThemeMode, ThemeTokenOverrides } from "./types";
import type { ThemeComponents } from "./components.types";

import { ThemeComponentsProvider } from "./components-context";
import { ThemeScopeProvider } from "./scope-context";

import { resolveFontStylesheets } from "./fonts/resolve-font-stylesheets";
import { createThemeVariables } from "./create-theme-variables";
import { createThemeCss } from "./create-theme-css";

import "./theme.css";
import "./theme-scopes.css";

type ThemeScope = "root" | "local";

type ThemeProps = {
  /** Nonce for the generated style element when using a strict CSP. */
  nonce?: string;

  /** Active color scheme. */
  theme?: ThemeMode;

  /**
   * Theme scope.
   *
   * - root: preserves the existing document-wide theme behaviour.
   * - local: applies tokens only to this subtree and its portals.
   */
  scope?: ThemeScope;

  /** Font configuration for heading, body and accent roles. */
  fonts?: Partial<Record<FontRole, FontConfig>>;

  /** Deeply partial overrides of the default design tokens. */
  tokens?: ThemeTokenOverrides;

  /** Color theme selection. */
  colorTheme?: ColorThemes;

  /**
   * Global component overrides.
   *
   * In React Server Component environments, component values must be
   * serializable Client Component references.
   */
  components?: ThemeComponents;
};

const Theme = ({
  nonce,
  fonts,
  theme = "system",
  scope = "root",
  tokens,
  colorTheme,
  components,
  children,
}: PropsWithChildren<ThemeProps>) => {
  const scopeId = useId();

  const fontStylesheets = resolveFontStylesheets(fonts);
  const cssVariables = createThemeVariables(fonts, tokens, theme, colorTheme);

  const cssSelector =
    scope === "root" ? ":root" : `[data-puzzle-theme-scope="${scopeId}"]`;

  const css = `${cssSelector} {\n${createThemeCss(cssVariables)}\n}`;

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

  return (
    <>
      {fontStylesheets.length > 0 ? (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </>
      ) : null}

      {fontStylesheets.map(({ href }) => (
        <link key={href} rel="stylesheet" href={href} precedence="default" />
      ))}

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

export { Theme, type ThemeProps, type ThemeScope };
