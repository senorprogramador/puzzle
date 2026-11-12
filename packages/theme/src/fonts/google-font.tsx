import {
  createThemeVariables,
  resolveThemeTokens,
} from "../create-theme-variables";

import { resolveFontStylesheets } from "./resolve-font-stylesheets";
import { createLocalFontStylesheetUrl } from "./create-local-font-stylesheet-url";

import type { FontConfig, FontSource } from "./types";

type GoogleFontProps = FontConfig & {
  fontSource?: FontSource;
  fontBasePath?: string;
};

/**
 * Standalone font loader.
 *
 * Theme is recommended when you want the full token system.
 */
const GoogleFont = ({
  family,
  weights,
  styles,
  display,
  fallback,
  role = "body",
  nonce,
  fontSource = "google",
  fontBasePath = "/fonts",
}: GoogleFontProps) => {
  const fonts = {
    [role]: {
      family,
      weights,
      styles,
      display,
      fallback,
    },
  };

  const fontStylesheets = resolveFontStylesheets(fonts);

  const localFontStylesheet =
    fontSource === "local" && fontStylesheets.length > 0
      ? createLocalFontStylesheetUrl(fontBasePath)
      : null;

  const resolved = resolveThemeTokens();

  const variables = createThemeVariables(fonts, resolved);

  const fontVariable = `--puzzle-font-${role}`;

  const declarations = `${fontVariable}: ${variables[fontVariable]};`;

  return (
    <>
      {fontSource === "google" && fontStylesheets.length > 0 ? (
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
          rel="stylesheet"
          href={localFontStylesheet}
          precedence="default"
        />
      ) : null}

      <style nonce={nonce}>{`:root { ${declarations} }`}</style>
    </>
  );
};

export { GoogleFont };
