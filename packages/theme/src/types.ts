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

/**
 * Semantic colors for one color scheme.
 *
 * Components should consume these semantic CSS variables rather
 * than defining their own foreground and background colors.
 */
export type ThemeColorSchemeTokens = {
  /** Main application canvas. */
  background: string;

  /** Default component surface. */
  surface: string;

  /** Raised surfaces, such as popovers and cards. */
  surfaceElevated: string;

  /** Recessed surfaces, such as subtle input backgrounds. */
  surfaceSunken: string;

  /** Primary foreground text. */
  text: string;

  /** Secondary, less prominent text. */
  textMuted: string;

  /** Tertiary text, such as placeholders and supplementary labels. */
  textSubtle: string;

  /** Default separator and component border. */
  border: string;

  /** Emphasized border. */
  borderStrong: string;

  /** Primary action and interactive color. */
  primary: string;
  primaryForeground: string;

  /** Secondary action and interactive color. */
  secondary: string;
  secondaryForeground: string;

  /** Accent color for emphasis. */
  accent: string;
  accentForeground: string;

  /** Keyboard focus indicator. */
  ring: string;

  /** Semantic feedback colors. */
  success: string;
  successForeground: string;

  warning: string;
  warningForeground: string;

  danger: string;
  dangerForeground: string;

  info: string;
  infoForeground: string;
};

/**
 * Central design tokens for Puzzle.
 *
 * Keep component styling independent of concrete color schemes.
 * Color scheme selection is handled by theme.css.
 */
export type ThemeTokens = {
  colorSchemes: {
    light: ThemeColorSchemeTokens;
    dark: ThemeColorSchemeTokens;
  };

  typography: {
    /** Base font-size scale. */
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

    /** Named font weights. */
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
    };

    /** Line-height scale. */
    lineHeight: {
      none: string;
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
      loose: string;
    };

    /** Letter-spacing scale. */
    letterSpacing: {
      tighter: string;
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };

    /** Vertical rhythm between text blocks. */
    fontGap: {
      /** Gap between consecutive headings. */
      headingStackGap: string;

      /** Gap between a heading and its following paragraph. */
      headingParagraphGap: string;

      /** Gap between consecutive paragraphs. */
      paragraphGap: string;

      /** Gap before a heading that follows a paragraph. */
      sectionGap: string;
    };

    /**
     * Named typography roles used by global elements and components.
     *
     * Optional for backwards-compatible input. Resolved themes always
     * contain every role.
     */
    roles?: Partial<Record<TypographyStyle, ThemeTypographyRoleTokens>>;
  };

  /** Spacing scale used by layout and components. */
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

  /** Border-radius scale. */
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

  /** General-purpose box-shadow tokens. */
  shadows: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  /**
   * Elevation levels used by components such as Paper.
   *
   * These are separate from the general-purpose shadow scale so
   * existing elevation APIs can remain stable.
   */
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

  /**
   * Responsive breakpoints.
   *
   * These values are exposed as CSS variables for consumers and
   * JavaScript integrations. Component CSS uses build-time custom-media
   * aliases from breakpoints.css; runtime theme overrides cannot change
   * compiled @media thresholds.
   */
  breakpoints: {
    compact: string;
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

export type ResolvedThemeTokens = Omit<ThemeTokens, "typography"> & {
  typography: Omit<ThemeTokens["typography"], "roles"> & {
    roles: Record<TypographyStyle, ThemeTypographyRoleTokens>;
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

/**
 * Deeply partial overrides are supported throughout the token tree.
 *
 * For example:
 * {
 *   colorSchemes: {
 *     dark: {
 *       background: "#101010"
 *     }
 *   },
 *   typography: {
 *     fontSize: {
 *       base: "1.125rem"
 *     },
 *     roles: {
 *       body1: {
 *         letterSpacing: "0.02em"
 *       }
 *     }
 *   }
 * }
 */
export type ThemeTokenOverrides = DeepPartial<ThemeTokens>;
