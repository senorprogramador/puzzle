import { assertSafeCssValue } from "@puzzle-ui/core";
import {
  COLOR_THEMES,
  DEFAULT_COLOR_SCHEME,
  THEME_TOKEN_REGISTRY,
  type ColorThemes,
  type FontRole,
  type GoogleFontFamily,
  type ThemeFonts,
  type ThemeColorSchemeTokens,
  type ThemeMode,
  type ThemeTokenOverrides,
  type ThemeTokenRegistryEntry,
} from "@puzzle-ui/theme";

import projectFonts from "../../puzzle-fonts.json";

export const WEBSITE_TEMPLATES = [
  { id: "marketing", label: "Marketing" },
  { id: "bnb", label: "B&B" },
  { id: "restaurant", label: "Restaurant" },
  { id: "blog", label: "Blog" },
  { id: "corporate", label: "Corporate" },
] as const;

export type WebsiteTemplate = (typeof WEBSITE_TEMPLATES)[number]["id"];

export const SPACING_PRESETS = [
  { id: "compact", label: "Compact", scale: 0.75 },
  { id: "tight", label: "Tight", scale: 0.875 },
  { id: "default", label: "Default", scale: 1 },
  { id: "loose", label: "Loose", scale: 1.125 },
  { id: "spacious", label: "Spacious", scale: 1.25 },
] as const;

export type SpacingPreset = (typeof SPACING_PRESETS)[number]["id"];

export const PREVIEW_PAGES = ["home", "about", "contact"] as const;

export type PreviewPage = (typeof PREVIEW_PAGES)[number];

export type ThemeStudioState = {
  template: WebsiteTemplate;
  page: PreviewPage;
  colorTheme: ColorThemes | null;
  mode: ThemeMode;
  fonts: ThemeFonts;
  tokens: ThemeTokenOverrides;
};

const DEFAULT_FONT_CONFIGURATION = projectFonts as unknown as ThemeFonts;

const cloneFontConfiguration = (fonts: ThemeFonts): ThemeFonts =>
  Object.fromEntries(
    Object.entries(fonts).map(([role, config]) => [
      role,
      config
        ? {
            ...config,
            ...(config.weights ? { weights: [...config.weights] } : {}),
            ...(config.weightRange
              ? { weightRange: [...config.weightRange] }
              : {}),
            ...(config.styles ? { styles: [...config.styles] } : {}),
            ...(config.fallback ? { fallback: [...config.fallback] } : {}),
          }
        : config,
    ]),
  ) as ThemeFonts;

export const INITIAL_THEME_STUDIO_STATE: ThemeStudioState = {
  template: "marketing",
  page: "home",
  colorTheme: null,
  mode: "light",
  fonts: cloneFontConfiguration(DEFAULT_FONT_CONFIGURATION),
  tokens: {},
};

export const COLOR_ROLES = Object.keys(
  DEFAULT_COLOR_SCHEME.light,
) as (keyof ThemeColorSchemeTokens)[];

export const FEATURED_COLOR_ROLES = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
] as const satisfies readonly (keyof ThemeColorSchemeTokens)[];

export type EditableColorRole = keyof ThemeColorSchemeTokens;

export type ThemeStudioAction =
  | { type: "template"; template: WebsiteTemplate }
  | { type: "page"; page: PreviewPage }
  | { type: "mode"; mode: ThemeMode }
  | {
      type: "font";
      role: FontRole;
      family: GoogleFontFamily | undefined;
    }
  | { type: "preset"; colorTheme: ColorThemes | null }
  | { type: "spacing-preset"; spacingPreset: SpacingPreset }
  | {
      type: "color";
      scheme: "light" | "dark";
      role: EditableColorRole;
      value: string;
    }
  | { type: "token"; path: readonly string[]; value: string }
  | { type: "reset-token"; path: readonly string[] }
  | { type: "reset-token-group"; path: readonly string[] }
  | { type: "reset-design-tokens" }
  | { type: "restore-preset" }
  | { type: "reset-default" };

export type ParsedCssNumber = {
  value: number;
  unit: string;
};

const DIMENSION_UNITS = new Set([
  "",
  "px",
  "rem",
  "em",
  "ch",
  "%",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "pt",
]);

const parseNumberWithUnit = (
  value: string,
  units: ReadonlySet<string>,
): ParsedCssNumber | null => {
  const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/i.exec(
    value.trim(),
  );
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2]?.toLowerCase() ?? "";

  return Number.isFinite(amount) && units.has(unit)
    ? { value: amount, unit }
    : null;
};

export const parseDimensionValue = (
  value: string,
): ParsedCssNumber | null => parseNumberWithUnit(value, DIMENSION_UNITS);

export const parseDurationValue = (
  value: string,
): ParsedCssNumber | null => parseNumberWithUnit(value, new Set(["ms", "s"]));

export const formatDimensionValue = (
  value: number,
  unit: string,
): string | null =>
  Number.isFinite(value) && DIMENSION_UNITS.has(unit)
    ? `${String(value)}${unit}`
    : null;

export const formatDurationValue = (
  value: number,
  unit: string,
): string | null =>
  Number.isFinite(value) && (unit === "ms" || unit === "s")
    ? `${String(value)}${unit}`
    : null;

export const getThemeTokenPath = (
  entry: ThemeTokenRegistryEntry,
): readonly string[] => [...entry.group.split("."), entry.name];

export const getThemeTokenGroups = (): readonly string[] =>
  [...new Set(THEME_TOKEN_REGISTRY.map((entry) => entry.group))];

export const getThemeTokenEntries = (
  group: string,
): readonly ThemeTokenRegistryEntry[] =>
  THEME_TOKEN_REGISTRY.filter((entry) => entry.group === group);

const getSpacingEntries = () =>
  THEME_TOKEN_REGISTRY.filter((entry) => entry.group === "spacing");

const scaleSpacingValue = (value: string, scale: number): string => {
  const match = /^(-?(?:\d+|\d*\.\d+))([a-z%]*)$/i.exec(value.trim());
  if (!match) return value;

  const [, amount, unit] = match;
  const scaledAmount = Number((Number(amount) * scale).toFixed(6));
  return `${scaledAmount}${unit}`;
};

const getSpacingPresetValue = (
  defaultValue: string,
  preset: SpacingPreset,
): string => {
  if (preset === "default") return defaultValue;

  const scale = SPACING_PRESETS.find(({ id }) => id === preset)?.scale;
  if (scale === undefined) {
    throw new Error(`Unknown spacing preset "${preset}".`);
  }

  return scaleSpacingValue(defaultValue, scale);
};

export const getSelectedSpacingPreset = (
  tokens: ThemeTokenOverrides,
): SpacingPreset | null => {
  const entries = getSpacingEntries();
  const hasSpacingOverrides = entries.some(
    (entry) => getThemeTokenValue(tokens, entry) !== entry.defaultValue,
  );
  if (!hasSpacingOverrides) return "default";

  const preset = SPACING_PRESETS.find(
    ({ id }) =>
      id !== "default" &&
      entries.every(
        (entry) =>
          getThemeTokenValue(tokens, entry) ===
          getSpacingPresetValue(entry.defaultValue, id),
      ),
  );

  return preset?.id ?? null;
};

export const getThemeTokenValue = (
  tokens: ThemeTokenOverrides,
  entry: ThemeTokenRegistryEntry,
): string => {
  let value: unknown = tokens;

  for (const segment of getThemeTokenPath(entry)) {
    if (typeof value !== "object" || value === null) break;
    value = (value as Record<string, unknown>)[segment];
  }

  return typeof value === "string" ? value : entry.defaultValue;
};

export const hasThemeTokenOverrides = (
  tokens: ThemeTokenOverrides,
  group?: string,
): boolean =>
  THEME_TOKEN_REGISTRY.some((entry) => {
    if (group && entry.group !== group) return false;

    let value: unknown = tokens;
    for (const segment of getThemeTokenPath(entry)) {
      if (typeof value !== "object" || value === null) return false;
      value = (value as Record<string, unknown>)[segment];
    }

    return typeof value === "string";
  });

const updateNestedToken = (
  value: unknown,
  path: readonly string[],
  nextValue: string | undefined,
): unknown => {
  const [key, ...remainingPath] = path;
  if (!key) return value;

  const source =
    typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const updated = { ...source };

  if (remainingPath.length === 0) {
    if (nextValue === undefined) {
      delete updated[key];
    } else {
      updated[key] = nextValue;
    }

    return updated;
  }

  const child = updateNestedToken(source[key], remainingPath, nextValue);

  if (
    typeof child === "object" &&
    child !== null &&
    !Array.isArray(child) &&
    Object.keys(child).length === 0
  ) {
    delete updated[key];
  } else {
    updated[key] = child;
  }

  return updated;
};

const withoutDesignTokenOverrides = (
  tokens: ThemeTokenOverrides,
): ThemeTokenOverrides => {
  const { colorSchemes } = tokens;
  return colorSchemes === undefined ? {} : { colorSchemes };
};

export const getColorThemeName = (identifier: string): string =>
  identifier
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const getColorThemePresets = () =>
  (Object.keys(COLOR_THEMES) as ColorThemes[]).map((id) => ({
    id,
    name: getColorThemeName(id),
    colors: COLOR_THEMES[id].light,
  }));

export const getBaseColorScheme = (
  colorTheme: ColorThemes | null,
  mode: "light" | "dark",
): ThemeColorSchemeTokens => {
  if (colorTheme === null) return DEFAULT_COLOR_SCHEME[mode];

  const preset = COLOR_THEMES[colorTheme];
  return mode === "light"
    ? preset.light
    : { ...preset.light, ...preset.dark };
};

const hasOverrides = (value: unknown): boolean => {
  if (typeof value !== "object" || value === null) return value !== undefined;

  return Object.values(value).some(hasOverrides);
};

const fontConfigurationsEqual = (left: ThemeFonts, right: ThemeFonts) =>
  JSON.stringify(left) === JSON.stringify(right);

export const isThemeCustomized = (
  tokens: ThemeTokenOverrides,
  fonts: ThemeFonts = DEFAULT_FONT_CONFIGURATION,
): boolean =>
  hasOverrides(tokens) ||
  !fontConfigurationsEqual(fonts, DEFAULT_FONT_CONFIGURATION);

export const hasColorOverrides = (
  tokens: ThemeTokenOverrides,
): boolean => hasOverrides(tokens.colorSchemes);

export const getSelectedFontConfiguration = (
  state: Pick<ThemeStudioState, "fonts">,
): ThemeFonts => cloneFontConfiguration(state.fonts);

export const createPuzzleFontsJson = (
  state: Pick<ThemeStudioState, "fonts">,
): string => {
  const configuredFonts = getSelectedFontConfiguration(state);
  const fonts =
    Object.keys(configuredFonts).length > 0
      ? configuredFonts
      : cloneFontConfiguration(DEFAULT_FONT_CONFIGURATION);

  return `${JSON.stringify(fonts, null, 2)}\n`;
};

const withoutColorOverrides = (
  tokens: ThemeTokenOverrides,
): ThemeTokenOverrides => {
  const { colorSchemes: _colorSchemes, ...remainingTokens } = tokens;
  return remainingTokens;
};

const getEntryAtPath = (
  path: readonly string[],
): ThemeTokenRegistryEntry | undefined =>
  THEME_TOKEN_REGISTRY.find((entry) => {
    const entryPath = getThemeTokenPath(entry);
    return (
      entryPath.length === path.length &&
      entryPath.every((segment, index) => segment === path[index])
    );
  });

export const themeStudioReducer = (
  state: ThemeStudioState,
  action: ThemeStudioAction,
): ThemeStudioState => {
  switch (action.type) {
    case "template":
      return { ...state, template: action.template };
    case "page":
      return { ...state, page: action.page };
    case "mode":
      return { ...state, mode: action.mode };
    case "font": {
      const fonts = cloneFontConfiguration(state.fonts);

      if (action.family === undefined) {
        if (Object.keys(fonts).length <= 1 || !fonts[action.role]) return state;
        delete fonts[action.role];
      } else {
        const current = fonts[action.role];
        fonts[action.role] = current
          ? { ...current, family: action.family }
          : { family: action.family };
      }

      return { ...state, fonts };
    }
    case "preset":
      return {
        ...state,
        colorTheme: action.colorTheme,
        tokens: withoutColorOverrides(state.tokens),
      };
    case "spacing-preset": {
      const baseTokens = updateNestedToken(
        state.tokens,
        ["spacing"],
        undefined,
      ) as ThemeTokenOverrides;
      if (action.spacingPreset === "default") {
        return { ...state, tokens: baseTokens };
      }

      const tokens = getSpacingEntries().reduce(
        (currentTokens, entry) =>
          updateNestedToken(
            currentTokens,
            getThemeTokenPath(entry),
            getSpacingPresetValue(entry.defaultValue, action.spacingPreset),
          ) as ThemeTokenOverrides,
        baseTokens,
      );

      return { ...state, tokens };
    }
    case "restore-preset":
      return {
        ...state,
        tokens: withoutColorOverrides(state.tokens),
      };
    case "token": {
      const entry = getEntryAtPath(action.path);
      if (!entry) {
        throw new TypeError(`Unknown Theme token path "${action.path.join(".")}".`);
      }

      const value = assertSafeCssValue(
        action.value,
        `Theme Studio ${entry.group}.${entry.name}`,
      );
      return {
        ...state,
        tokens: updateNestedToken(
          state.tokens,
          action.path,
          value === entry.defaultValue ? undefined : value,
        ) as ThemeTokenOverrides,
      };
    }
    case "reset-token":
    case "reset-token-group":
      return {
        ...state,
        tokens: updateNestedToken(
          state.tokens,
          action.path,
          undefined,
        ) as ThemeTokenOverrides,
      };
    case "reset-design-tokens":
      return {
        ...state,
        tokens: withoutDesignTokenOverrides(state.tokens),
      };
    case "reset-default":
      return {
        ...state,
        colorTheme: null,
        mode: "light",
        fonts: cloneFontConfiguration(DEFAULT_FONT_CONFIGURATION),
        tokens: {},
      };
    case "color": {
      const base = getBaseColorScheme(state.colorTheme, action.scheme);
      const value = assertSafeCssValue(
        action.value,
        `Theme Studio colorSchemes.${action.scheme}.${action.role}`,
      );
      const schemeOverrides = {
        ...(state.tokens.colorSchemes?.[action.scheme] ?? {}),
      };

      if (value.toLowerCase() === base[action.role].toLowerCase()) {
        delete schemeOverrides[action.role];
      } else {
        schemeOverrides[action.role] = value;
      }

      const colorSchemes = { ...state.tokens.colorSchemes };

      if (Object.keys(schemeOverrides).length > 0) {
        colorSchemes[action.scheme] = schemeOverrides;
      } else {
        delete colorSchemes[action.scheme];
      }

      return {
        ...state,
        tokens: {
          ...withoutColorOverrides(state.tokens),
          ...(Object.keys(colorSchemes).length > 0 ? { colorSchemes } : {}),
        },
      };
    }
  }
};

export const getThemeConfiguration = (
  state: Pick<
    ThemeStudioState,
    "colorTheme" | "mode" | "fonts" | "tokens"
  >,
) => {
  const fonts = getSelectedFontConfiguration(state);
  const hasFonts = Object.keys(fonts).length > 0;
  const hasTokenOverrides = hasOverrides(state.tokens);

  return {
    theme: state.mode,
    ...(state.colorTheme ? { colorTheme: state.colorTheme } : {}),
    ...(hasFonts ? { fonts, fontSource: "local" as const } : {}),
    ...(hasTokenOverrides ? { tokens: state.tokens } : {}),
  };
};

export const createThemeImplementation = (
  state: Pick<ThemeStudioState, "colorTheme" | "mode" | "fonts" | "tokens">,
): string => {
  const configuration = getThemeConfiguration(state);
  const props = [`theme="${configuration.theme}"`];

  if (configuration.colorTheme) {
    props.push(`colorTheme="${configuration.colorTheme}"`);
  }

  if (configuration.fonts) {
    const formattedFonts = JSON.stringify(
      configuration.fonts,
      null,
      2,
    ).replaceAll("\n", "\n      ");
    props.push(`fonts={${formattedFonts}}`);
    props.push('fontSource="local"');
  }

  if (configuration.tokens) {
    const formattedTokens = JSON.stringify(state.tokens, null, 2).replaceAll(
      "\n",
      "\n      ",
    );
    props.push(`tokens={${formattedTokens}}`);
  }

  return [
    'import { Theme } from "@puzzle-ui/theme";',
    "",
    "export function App() {",
    "  return (",
    `    <Theme\n${props.map((prop) => `      ${prop}`).join("\n")}\n    >`,
    "      <YourApp />",
    "    </Theme>",
    "  );",
    "}",
  ].join("\n");
};
