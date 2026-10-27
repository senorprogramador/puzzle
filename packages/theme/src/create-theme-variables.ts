import {
  assertSafeCssValue,
  type DeepPartial,
  stringWithCasing,
} from "@puzzle/core";
import type { ThemeFonts } from "./fonts";
import { resolveFontConfig } from "./fonts/resolve-font-config";
import { DEFAULT_FONT_FALLBACKS } from "./fonts/constants";
import type { ThemeTokens } from "./types";
import { DEFAULT_TOKENS, GENERIC_FAMILIES } from "./constants";
import { createFluidFontSize, typographyDefaults } from "./fonts/typography";

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

export const resolveThemeTokens = (overrides?: DeepPartial<ThemeTokens>) => {
  return mergeKnownShape(
    DEFAULT_TOKENS,
    overrides,
    "tokens",
  ) as unknown as ThemeTokens;
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

export const createThemeVariables = (
  fonts?: ThemeFonts,
  tokens?: Partial<ThemeTokens>,
  theme: "light" | "dark" | "system" = "system",
  customVariables?: Record<string, string | number>,
) => {
  const output: Record<string, string> = {};
  const resolvedTokens = resolveThemeTokens(tokens);

  setGroupVariables(output, "color", resolvedTokens.colors);
  setGroupVariables(output, "font-size", resolvedTokens.typography.fontSize);
  setGroupVariables(
    output,
    "font-weight",
    resolvedTokens.typography.fontWeight,
  );
  setGroupVariables(
    output,
    "line-height",
    resolvedTokens.typography.lineHeight,
  );
  setGroupVariables(
    output,
    "letter-spacing",
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
  output["--puzzle-border-width"] = assertSafeCssValue(
    resolvedTokens.borders.width,
    "resolvedTokens.borders.width",
  );
  output["--puzzle-border-width-strong"] = assertSafeCssValue(
    resolvedTokens.borders.widthStrong,
    "resolvedTokens.borders.widthStrong",
  );
  output["--puzzle-border-style"] = assertSafeCssValue(
    resolvedTokens.borders.style,
    "resolvedTokens.borders.style",
  );
  output["--puzzle-container-width"] = assertSafeCssValue(
    resolvedTokens.layout.container,
    "resolvedTokens.layout.container",
  );
  output["--puzzle-content-width"] = assertSafeCssValue(
    resolvedTokens.layout.content,
    "resolvedTokens.layout.content",
  );
  output["--puzzle-prose-width"] = assertSafeCssValue(
    resolvedTokens.layout.prose,
    "resolvedTokens.layout.prose",
  );
  output["--puzzle-duration-fast"] = assertSafeCssValue(
    resolvedTokens.motion.fast,
    "resolvedTokens.motion.fast",
  );
  output["--puzzle-duration-normal"] = assertSafeCssValue(
    resolvedTokens.motion.normal,
    "resolvedTokens.motion.normal",
  );
  output["--puzzle-duration-slow"] = assertSafeCssValue(
    resolvedTokens.motion.slow,
    "resolvedTokens.motion.slow",
  );
  output["--puzzle-easing-standard"] = assertSafeCssValue(
    resolvedTokens.motion.easingStandard,
    "resolvedTokens.motion.easingStandard",
  );
  output["--puzzle-easing-in"] = assertSafeCssValue(
    resolvedTokens.motion.easingIn,
    "resolvedTokens.motion.easingIn",
  );
  output["--puzzle-easing-out"] = assertSafeCssValue(
    resolvedTokens.motion.easingOut,
    "resolvedTokens.motion.easingOut",
  );
  setGroupVariables(output, "z-index", resolvedTokens.zIndex);

  for (const [name, typography] of Object.entries(typographyDefaults)) {
    const role = typography.font;
    const config = fonts?.[role];
    if (!config) {
      const fontFamily = DEFAULT_FONT_FALLBACKS[role];
      const fontSizeRem = typography.size / 16;
      const letterSpacingEm = typography.letterSpacing / typography.size;
      output[`--puzzle-font-family-${name}`] = fontFamily.join(", ");
      output[`--puzzle-font-size-${name}`] =
        "responsive" in typography
          ? createFluidFontSize(typography.responsive)
          : `${fontSizeRem}rem`;
      output[`--puzzle-font-letter-spacing-${name}`] = `${letterSpacingEm}em`;
      output[`--puzzle-font-line-height-${name}`] = `${typography.lineHeight}`;
      output[`--puzzle-font-weight-${name}`] = `${typography.weight}`;
      continue;
    }
    const resolved = resolveFontConfig({ ...config, role });
    const fontFamily = buildFontFamilyValue(resolved.family, resolved.fallback);
    const fontSizeRem = typography.size / 16;
    const letterSpacingEm = typography.letterSpacing / typography.size;
    output[`--puzzle-font-family-${name}`] = fontFamily;
    output[`--puzzle-font-size-${name}`] =
      "responsive" in typography
        ? createFluidFontSize(typography.responsive)
        : `${fontSizeRem}rem`;
    output[`--puzzle-font-letter-spacing-${name}`] = `${letterSpacingEm}em`;
    output[`--puzzle-font-line-height-${name}`] = `${typography.lineHeight}`;
    output[`--puzzle-font-weight-${name}`] = `${typography.weight}`;
  }

  for (const role of ["heading", "body", "accent"] as const) {
    const config = fonts?.[role];
    if (config) {
      const resolved = resolveFontConfig({ ...config, role });
      output[`--puzzle-font-${role}`] = buildFontFamilyValue(
        resolved.family,
        resolved.fallback,
      );
    } else {
      output[`--puzzle-font-${role}`] = DEFAULT_FONT_FALLBACKS[role]
        .map(quoteCssFontFamily)
        .join(", ");
    }
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
