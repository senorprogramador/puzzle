import type { PropsWithChildren } from "react";
import type { FontRole, FontConfig } from "./fonts";
import type { ThemeMode, ThemeTokenOverrides } from "./types";
import type { ThemeComponents } from "./components.types";
import { ThemeComponentsProvider } from "./components-context";
import { resolveFontStylesheets } from "./fonts/resolve-font-stylesheets";
import { createThemeVariables } from "./create-theme-variables";
import { createThemeCss } from "./create-theme-css";
import "./theme.css";

type ThemeProps = {
  /** Nonce for the generated style element when using a strict CSP. */
  nonce?: string;

  /** Active color scheme. */
  theme?: ThemeMode;

  /** Font configuration for heading, body and accent roles. */
  fonts?: Partial<Record<FontRole, FontConfig>>;

  /** Deeply partial overrides of the default design tokens. */
  tokens?: ThemeTokenOverrides;

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
  tokens,
  components,
  children,
}: PropsWithChildren<ThemeProps>) => {
  const fontStylesheets = resolveFontStylesheets(fonts);
  const cssVariables = createThemeVariables(fonts, tokens, theme);
  const css = `:root {\n${createThemeCss(cssVariables)}\n}`;

  /*
   * Only create a provider when a component configuration is supplied.
   *
   * This lets nested Theme instances inherit the parent configuration
   * when their own `components` prop is omitted.
   *
   * An explicitly supplied empty object resets the configuration.
   */
  const content =
    components === undefined ? (
      children
    ) : (
      <ThemeComponentsProvider components={components}>
        {children}
      </ThemeComponentsProvider>
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

      <style nonce={nonce} data-theme={theme} data-puzzle-theme="true">
        {css}
      </style>

      {content}
    </>
  );
};

export { Theme, type ThemeProps };
