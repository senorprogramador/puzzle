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
import "./global.css";

export type ThemeScope = "root" | "local";

export type ThemeProps = {
  nonce?: string;
  theme?: ThemeMode;
  scope?: ThemeScope;
  globalStyles?: boolean;
  fonts?: Partial<Record<FontRole, FontConfig>>;
  tokens?: ThemeTokenOverrides;
  colorTheme?: ColorThemes;
  components?: ThemeComponents;
};

const Theme = ({
  nonce,
  fonts,
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
