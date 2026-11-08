import { assertSafeCssValue, stringWithCasing } from "@puzzle/core";
import type { ThemeFonts } from "./fonts";
import { resolveFontConfig } from "./fonts/resolve-font-config";
import { DEFAULT_FONT_FALLBACKS } from "./fonts/constants";
import type {
  ColorThemes,
  ThemeMode,
  ThemeTokenOverrides,
  ThemeTokens,
} from "./types";
import { COLOR_THEMES, DEFAULT_TOKENS, GENERIC_FAMILIES } from "./constants";
import { DEFAULT_TYPOGRAPHY_ROLES } from "./fonts/typography";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const structuredCloneSafe = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(structuredCloneSafe) as T;

  if (isRecord(value)) {
    const copy: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(value)) {
      copy[key] = structuredCloneSafe(child);
    }

    return copy as T;
  }

  return value;
};

const mergeKnownShape = <T extends Record<string, unknown>>(
  defaults: T,
  override: unknown,
  path: string,
): T => {
  if (override === undefined) return structuredCloneSafe(defaults);

  if (!isRecord(override)) {
    throw new TypeError(`${path} must be an object.`);
  }

  for (const key of Object.keys(override)) {
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) {
      throw new TypeError(`Unknown theme token: ${path}.${key}`);
    }
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(defaults)) {
    const defaultValue = defaults[key];
    const overrideValue = override[key];

    if (isRecord(defaultValue)) {
      result[key] = mergeKnownShape(
        defaultValue as Record<string, unknown>,
        overrideValue,
        `${path}.${key}`,
      );
    } else if (overrideValue === undefined) {
      result[key] = defaultValue;
    } else {
      result[key] = assertSafeCssValue(overrideValue, `${path}.${key}`);
    }
  }

  return result as T;
};

const setGroupVariables = (
  output: Record<string, string>,
  prefix: string,
  values: Record<string, unknown>,
) => {
  for (const [key, value] of Object.entries(values)) {
    output[`--puzzle-${prefix}-${stringWithCasing(key, "kebabcase")}`] =
      assertSafeCssValue(value, `token ${prefix}.${key}`);
  }
};

const quoteCssFontFamily = (family: string) => {
  if (GENERIC_FAMILIES.has(family.toLowerCase())) return family;

  return `"${family.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
};

const buildFontFamilyValue = (family: string, fallback: readonly string[]) => {
  return [family, ...fallback].map(quoteCssFontFamily).join(", ");
};

export const resolveThemeTokens = (
  overrides?: ThemeTokenOverrides,
  colorTheme?: ColorThemes,
): ThemeTokens => {
  let defaultTokens = DEFAULT_TOKENS;

  if (colorTheme) {
    defaultTokens = {
      ...DEFAULT_TOKENS,
      colorSchemes: {
        ...DEFAULT_TOKENS.colorSchemes,
        light: COLOR_THEMES[colorTheme].light,
        dark: {
          ...COLOR_THEMES[colorTheme].light,
          ...COLOR_THEMES[colorTheme].dark,
        },
      },
    };
  }

  const defaultsWithRoles = {
    ...defaultTokens,
    typography: {
      ...defaultTokens.typography,
      roles: DEFAULT_TYPOGRAPHY_ROLES,
    },
  };

  return mergeKnownShape(
    defaultsWithRoles as unknown as Record<string, unknown>,
    overrides,
    "tokens",
  ) as unknown as ThemeTokens;
};

export const createThemeVariables = (
  fonts?: ThemeFonts,
  tokens?: ThemeTokenOverrides,
  _theme: ThemeMode = "system",
  colorTheme?: ColorThemes,
  customVariables?: Record<string, string | number>,
): Record<string, string> => {
  const output: Record<string, string> = {};
  const resolvedTokens = resolveThemeTokens(tokens, colorTheme);

  setGroupVariables(
    output,
    "color-scheme-light",
    resolvedTokens.colorSchemes.light,
  );

  setGroupVariables(
    output,
    "color-scheme-dark",
    resolvedTokens.colorSchemes.dark,
  );

  setGroupVariables(output, "font-size", resolvedTokens.typography.fontSize);
  setGroupVariables(
    output,
    "font-weight",
    resolvedTokens.typography.fontWeight,
  );
  setGroupVariables(
    output,
    "font-line-height",
    resolvedTokens.typography.lineHeight,
  );
  setGroupVariables(
    output,
    "font-letter-spacing",
    resolvedTokens.typography.letterSpacing,
  );
  setGroupVariables(output, "font-gap", resolvedTokens.typography.fontGap);

  setGroupVariables(
    output,
    "space",
    resolvedTokens.spacing as unknown as Record<string, unknown>,
  );

  setGroupVariables(output, "radius", resolvedTokens.radius);
  setGroupVariables(output, "shadow", resolvedTokens.shadows);
  setGroupVariables(output, "elevation", resolvedTokens.elevation);
  setGroupVariables(output, "breakpoint", resolvedTokens.breakpoints);
  setGroupVariables(output, "overlay", resolvedTokens.overlays);
  setGroupVariables(output, "z-index", resolvedTokens.zIndex);

  output["--puzzle-border-width"] = assertSafeCssValue(
    resolvedTokens.borders.width,
    "tokens.borders.width",
  );
  output["--puzzle-border-width-strong"] = assertSafeCssValue(
    resolvedTokens.borders.widthStrong,
    "tokens.borders.widthStrong",
  );
  output["--puzzle-border-style"] = assertSafeCssValue(
    resolvedTokens.borders.style,
    "tokens.borders.style",
  );

  output["--puzzle-container-width"] = assertSafeCssValue(
    resolvedTokens.layout.container,
    "tokens.layout.container",
  );
  output["--puzzle-content-width"] = assertSafeCssValue(
    resolvedTokens.layout.content,
    "tokens.layout.content",
  );
  output["--puzzle-prose-width"] = assertSafeCssValue(
    resolvedTokens.layout.prose,
    "tokens.layout.prose",
  );

  output["--puzzle-duration-fast"] = assertSafeCssValue(
    resolvedTokens.motion.fast,
    "tokens.motion.fast",
  );
  output["--puzzle-duration-normal"] = assertSafeCssValue(
    resolvedTokens.motion.normal,
    "tokens.motion.normal",
  );
  output["--puzzle-duration-slow"] = assertSafeCssValue(
    resolvedTokens.motion.slow,
    "tokens.motion.slow",
  );
  output["--puzzle-easing-standard"] = assertSafeCssValue(
    resolvedTokens.motion.easingStandard,
    "tokens.motion.easingStandard",
  );
  output["--puzzle-easing-in"] = assertSafeCssValue(
    resolvedTokens.motion.easingIn,
    "tokens.motion.easingIn",
  );
  output["--puzzle-easing-out"] = assertSafeCssValue(
    resolvedTokens.motion.easingOut,
    "tokens.motion.easingOut",
  );

  /*
   * Named typography roles.
   *
   * These values are resolved from ThemeTokens, so overrides to individual
   * roles and to the base typography scales both affect the output.
   */
  for (const [name, typography] of Object.entries(
    resolvedTokens.typography.roles ?? DEFAULT_TYPOGRAPHY_ROLES,
  )) {
    const role = typography.font;
    const config = fonts?.[role];

    const fontFamily = config
      ? (() => {
          const resolved = resolveFontConfig({
            ...config,
            role,
          });

          return buildFontFamilyValue(resolved.family, resolved.fallback);
        })()
      : DEFAULT_FONT_FALLBACKS[role].map(quoteCssFontFamily).join(", ");

    output[`--puzzle-font-family-${name}`] = fontFamily;
    output[`--puzzle-font-size-${name}`] = assertSafeCssValue(
      typography.fontSize,
      `tokens.typography.roles.${name}.fontSize`,
    );
    output[`--puzzle-font-weight-${name}`] = assertSafeCssValue(
      typography.fontWeight,
      `tokens.typography.roles.${name}.fontWeight`,
    );
    output[`--puzzle-font-line-height-${name}`] = assertSafeCssValue(
      typography.lineHeight,
      `tokens.typography.roles.${name}.lineHeight`,
    );
    output[`--puzzle-font-letter-spacing-${name}`] = assertSafeCssValue(
      typography.letterSpacing,
      `tokens.typography.roles.${name}.letterSpacing`,
    );
  }

  /*
   * Font-family aliases.
   *
   * Keep both naming conventions for backwards compatibility.
   */
  for (const role of ["heading", "body", "accent"] as const) {
    const config = fonts?.[role];

    const fontFamily = config
      ? (() => {
          const resolved = resolveFontConfig({
            ...config,
            role,
          });

          return buildFontFamilyValue(resolved.family, resolved.fallback);
        })()
      : DEFAULT_FONT_FALLBACKS[role].map(quoteCssFontFamily).join(", ");

    output[`--puzzle-font-${role}`] = fontFamily;
    output[`--puzzle-font-family-${role}`] = fontFamily;
  }

  if (customVariables !== undefined) {
    for (const [name, value] of Object.entries(customVariables)) {
      if (!/^--puzzle-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
        throw new TypeError(
          `Custom CSS variable "${name}" must start with --puzzle- and contain only lowercase letters, numbers, and hyphens.`,
        );
      }

      output[name] = assertSafeCssValue(value, `variables.${name}`);
    }
  }

  return output;
};
