import {
  COLOR_THEMES,
  DEFAULT_COLOR_SCHEME,
  type ColorThemes,
  type ThemeColorSchemeTokens,
  type ThemeTokenOverrides,
} from "@puzzle-ui/theme";

export const WEBSITE_TEMPLATES = [
  { id: "marketing", label: "Marketing" },
  { id: "bnb", label: "B&B" },
  { id: "restaurant", label: "Restaurant" },
  { id: "blog", label: "Blog" },
  { id: "corporate", label: "Corporate" },
] as const;

export type WebsiteTemplate = (typeof WEBSITE_TEMPLATES)[number]["id"];

export const PREVIEW_PAGES = ["home", "about", "contact"] as const;

export type PreviewPage = (typeof PREVIEW_PAGES)[number];

export type ThemeStudioState = {
  template: WebsiteTemplate;
  page: PreviewPage;
  colorTheme: ColorThemes | null;
  mode: "light" | "dark";
  tokens: ThemeTokenOverrides;
};

export const INITIAL_THEME_STUDIO_STATE: ThemeStudioState = {
  template: "marketing",
  page: "home",
  colorTheme: null,
  mode: "light",
  tokens: {},
};

export const COLOR_ROLES = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
] as const;

export type EditableColorRole = (typeof COLOR_ROLES)[number];

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

export const isThemeCustomized = (tokens: ThemeTokenOverrides): boolean => {
  const schemes = tokens.colorSchemes;

  return (
    !!schemes &&
    Object.values(schemes).some(
      (scheme) => scheme !== undefined && Object.keys(scheme).length > 0,
    )
  );
};

export const themeStudioReducer = (
  state: ThemeStudioState,
  action:
    | { type: "template"; template: WebsiteTemplate }
    | { type: "page"; page: PreviewPage }
    | { type: "mode"; mode: "light" | "dark" }
    | { type: "preset"; colorTheme: ColorThemes | null }
    | {
        type: "color";
        role: EditableColorRole;
        value: string;
      }
    | { type: "restore-preset" }
    | { type: "reset-default" },
): ThemeStudioState => {
  switch (action.type) {
    case "template":
      return { ...state, template: action.template };
    case "page":
      return { ...state, page: action.page };
    case "mode":
      return { ...state, mode: action.mode };
    case "preset":
      return { ...state, colorTheme: action.colorTheme, tokens: {} };
    case "restore-preset":
      return { ...state, tokens: {} };
    case "reset-default":
      return { ...state, colorTheme: null, tokens: {} };
    case "color": {
      const base = getBaseColorScheme(state.colorTheme, state.mode);
      const schemeOverrides = {
        ...(state.tokens.colorSchemes?.[state.mode] ?? {}),
      };

      if (action.value.toLowerCase() === base[action.role].toLowerCase()) {
        delete schemeOverrides[action.role];
      } else {
        schemeOverrides[action.role] = action.value;
      }

      const colorSchemes = { ...state.tokens.colorSchemes };

      if (Object.keys(schemeOverrides).length > 0) {
        colorSchemes[state.mode] = schemeOverrides;
      } else {
        delete colorSchemes[state.mode];
      }

      return {
        ...state,
        tokens:
          Object.keys(colorSchemes).length > 0 ? { colorSchemes } : {},
      };
    }
  }
};

export const createThemeImplementation = (
  state: Pick<ThemeStudioState, "colorTheme" | "mode" | "tokens">,
): string => {
  const props = [`theme="${state.mode}"`];

  if (state.colorTheme) {
    props.push(`colorTheme="${state.colorTheme}"`);
  }

  if (isThemeCustomized(state.tokens)) {
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
