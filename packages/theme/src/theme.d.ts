import type { PropsWithChildren } from "react";
import type { FontRole, FontConfig } from "./fonts";
import type { ColorThemes, ThemeMode, ThemeTokenOverrides } from "./types";
import type { ThemeComponents } from "./components.types";
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
    /** Color theme selection. */
    colorTheme?: ColorThemes;
    /**
     * Global component overrides.
     *
     * In React Server Component environments, component values must be
     * serializable Client Component references.
     */
    components?: ThemeComponents;
};
declare const Theme: ({ nonce, fonts, theme, tokens, colorTheme, components, children, }: PropsWithChildren<ThemeProps>) => import("react").JSX.Element;
export { Theme, type ThemeProps };
