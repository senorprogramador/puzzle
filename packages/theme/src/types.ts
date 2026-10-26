export type ThemeTokens = {
  colors: {
    darkForeground: string;
    lightForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    //background: string;
    surface: string;
    surfaceElevated: string;
    //text: string;
    textMuted: string;
    border: string;
    borderStrong: string;
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
  typography: {
    /** The size of the font, controlling the overall scale of text. */
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
    /** The weight of the font, controlling the thickness of characters. */
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
    };
    /** The vertical rhythm of text, controlling the spacing between lines. */
    lineHeight: {
      none: string;
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
      loose: string;
    };
    /** Spacing between characters. */
    letterSpacing: {
      tighter: string;
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };
    /** Vertical rhythm between adjacent headings and paragraphs. */
    fontGap: {
      /** Two consecutive headings (for example h1 followed by h2). */
      headingStackGap: string;
      /** A paragraph directly following a heading. */
      headingParagraphGap: string;
      /** Consecutive paragraphs. */
      paragraphGap: string;
      /** A heading following a paragraph starts a new text section. */
      sectionGap: string;
    };
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
  borders: {
    width: string;
    widthStrong: string;
    style: string;
  };
  layout: {
    container: string;
    content: string;
    prose: string;
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
    overlay: string;
    modal: string;
    popover: string;
    toast: string;
    tooltip: string;
  };
};
