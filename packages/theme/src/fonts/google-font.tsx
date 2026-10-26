import {
  createThemeVariables,
  resolveThemeTokens,
} from "../create-theme-variables";
import { resolveFontStylesheets } from "./resolve-font-stylesheets";
import { FontConfig } from "./types";

/** Standalone font loader; Theme is recommended when you want the full token system. */
const GoogleFont = ({
  family,
  weights,
  styles,
  display,
  fallback,
  role = "body",
  nonce,
}: FontConfig) => {
  const fonts = { [role]: { family, weights, styles, display, fallback } };
  const fontStylesheets = resolveFontStylesheets(fonts);
  const resolved = resolveThemeTokens();
  const variables = createThemeVariables(fonts, resolved);
  const fontVariable = `--puzzle-font-${role}`;
  const declarations = `${fontVariable}: ${variables[fontVariable]};`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {fontStylesheets.map(({ href }) => (
        <link key={href} rel="stylesheet" href={href} precedence="default" />
      ))}
      <style nonce={nonce}>{`:root { ${declarations} }`}</style>
    </>
  );
};

export { GoogleFont };
