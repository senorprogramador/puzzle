import type { PropsWithChildren } from "react";
import type { FontRole, FontConfig } from "./fonts";
import type { ThemeTokens } from "./types";
import { resolveFontStylesheets } from "./fonts/resolve-font-stylesheets";
import { createThemeVariables } from "./create-theme-variables";
import { createThemeCss } from "./create-theme-css";
import "./theme.css";

type ThemeProps = {
  /** Nonce for the generated style element when using a strict CSP. */
  nonce?: string;
  theme?: "light" | "dark" | "system";
  fonts?: Partial<Record<FontRole, FontConfig>>;
  tokens?: Partial<ThemeTokens>;
};

const Theme = ({
  nonce,
  fonts,
  theme = "system",
  tokens,
  children,
}: PropsWithChildren<ThemeProps>) => {
  const fontStylesheets = resolveFontStylesheets(fonts);
  const cssVariables = createThemeVariables(fonts, tokens, theme);
  const css = `:root {\n${createThemeCss(cssVariables)}\n}`;

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
      {children}
      <style nonce={nonce} data-theme={theme} data-puzzle-theme="true">
        {css}
      </style>
    </>
  );
};

export { Theme, type ThemeProps };
