import type { ThemeFonts } from "./fonts";
import type { ColorThemes, ThemeMode, ThemeTokenOverrides, ThemeTokens } from "./types";
export declare const resolveThemeTokens: (overrides?: ThemeTokenOverrides, colorTheme?: ColorThemes) => ThemeTokens;
export declare const createThemeVariables: (fonts?: ThemeFonts, tokens?: ThemeTokenOverrides, _theme?: ThemeMode, colorTheme?: ColorThemes, customVariables?: Record<string, string | number>) => Record<string, string>;
