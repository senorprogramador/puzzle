import type { DeepPartial } from "@puzzle/core";
import type { COLOR_THEMES } from "./constants";

export type ThemeMode = "light" | "dark" | "system";

export type TypographyStyle =
  | "display1"
  | "display2"
  | "headline1"
  | "headline2"
  | "headline3"
  | "headline4"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "button"
  | "caption"
  | "overline";

export type ThemeTypographyFontRole = "heading" | "body" | "accent";

export type ThemeTypographyRoleTokens = {
  font: ThemeTypographyFontRole;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
};

export type ThemeColorSchemeTokens = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSunken: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  ring: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  danger: string;
  dangerForeground: string;
  info: string;
  infoForeground: string;
};

export type ThemeTokens = {
  colorSchemes: {
    light: ThemeColorSchemeTokens;
    dark: ThemeColorSchemeTokens;
  };

  typography: {
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
      "5xl": string;
      "6xl": string;
    };

    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
    };

    lineHeight: {
      none: string;
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
      loose: string;
    };

    letterSpacing: {
      tighter: string;
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };

    fontGap: {
      headingStackGap: string;
      headingParagraphGap: string;
      paragraphGap: string;
      sectionGap: string;
    };

    /**
     * Named typography roles.
     *
     * Optional to keep existing user-defined theme objects backwards
     * compatible. The resolver supplies defaults for every role.
     */
    roles?: Partial<Record<TypographyStyle, ThemeTypographyRoleTokens>>;
  };

  spacing: {
    0: string;
    px: string;
    "0.5": string;
    1: string;
    "1.5": string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
  };

  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    full: string;
  };

  shadows: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  elevation: {
    1: string;
    2: string;
    3: string;
    4: string;
    6: string;
    8: string;
    12: string;
    16: string;
    24: string;
  };

  borders: {
    width: string;
    widthStrong: string;
    style: string;
  };

  breakpoints: {
    tablet: string;
    desktop: string;
    hd: string;
  };

  layout: {
    container: string;
    content: string;
    prose: string;
  };

  overlays: {
    backdrop: string;
    backdropBlur: string;
  };

  motion: {
    fast: string;
    normal: string;
    slow: string;
    easingStandard: string;
    easingIn: string;
    easingOut: string;
  };

  zIndex: {
    base: string;
    dropdown: string;
    sticky: string;
    navigation: string;
    overlay: string;
    modal: string;
    popover: string;
    toast: string;
    tooltip: string;
  };
};

export type ColorTheme = {
  light: ThemeTokens["colorSchemes"]["light"];
  dark: Pick<
    ThemeTokens["colorSchemes"]["dark"],
    | "primary"
    | "primaryForeground"
    | "secondary"
    | "secondaryForeground"
    | "accent"
    | "accentForeground"
  >;
};

export type ColorThemes = keyof typeof COLOR_THEMES;

export type ThemeTokenOverrides = DeepPartial<ThemeTokens>;
