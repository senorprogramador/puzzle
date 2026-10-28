import type { ThemeTokens } from "./types";

export const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "fangsong",
  "emoji",
]);

export const DEFAULT_TOKENS: ThemeTokens = {
  colorSchemes: {
    light: {
      background: "#f7f4ea",
      surface: "#ffffff",
      surfaceElevated: "#ffffff",
      surfaceSunken: "#f1eee6",

      text: "#171717",
      textMuted: "#666666",
      textSubtle: "#737373",

      border: "#e5e0d6",
      borderStrong: "#c9c2b6",

      primary: "#2563eb",
      primaryForeground: "#ffffff",

      secondary: "#64748b",
      secondaryForeground: "#ffffff",

      accent: "#7c3aed",
      accentForeground: "#ffffff",

      ring: "#2563eb",

      success: "#15803d",
      successForeground: "#ffffff",

      warning: "#a16207",
      warningForeground: "#ffffff",

      danger: "#b91c1c",
      dangerForeground: "#ffffff",

      info: "#0369a1",
      infoForeground: "#ffffff",
    },

    dark: {
      background: "#111518",
      surface: "#1c2226",
      surfaceElevated: "#242c31",
      surfaceSunken: "#0d1113",

      text: "#f5f5f5",
      textMuted: "#a4adb3",
      textSubtle: "#8c969d",

      border: "#343c42",
      borderStrong: "#4a555d",

      primary: "#60a5fa",
      primaryForeground: "#0b1220",

      secondary: "#94a3b8",
      secondaryForeground: "#0f172a",

      accent: "#c4b5fd",
      accentForeground: "#1e1b4b",

      ring: "#93c5fd",

      success: "#4ade80",
      successForeground: "#052e16",

      warning: "#fbbf24",
      warningForeground: "#422006",

      danger: "#f87171",
      dangerForeground: "#450a0a",

      info: "#38bdf8",
      infoForeground: "#082f49",
    },
  },
  typography: {
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
    lineHeight: {
      none: "1",
      tight: "1.15",
      snug: "1.3",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
    fontGap: {
      headingStackGap: "0.3em",
      headingParagraphGap: "0.65em",
      paragraphGap: "1em",
      sectionGap: "1.5em",
    },
  },
  spacing: {
    0: "0",
    px: "1px",
    "0.5": "0.125rem",
    1: "0.25rem",
    "1.5": "0.375rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
  },
  radius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  shadows: {
    none: "none",
    xs: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
    sm: "0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.1)",
    md: "0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)",
    lg: "0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)",
    xl: "0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)",
  },
  borders: {
    width: "1px",
    widthStrong: "2px",
    style: "solid",
  },
  breakpoints: {
    tablet: "768px",
    desktop: "1024px",
    hd: "1440px",
  },
  layout: {
    container: "80rem",
    content: "64rem",
    prose: "65ch",
  },
  overlays: {
    backdrop: "rgb(0 0 0 / 0.35)",
    backdropBlur: "2px",
  },
  elevation: {
    1: "0 1px 2px rgb(0 0 0 / 0.05)",
    2: "0 1px 3px rgb(0 0 0 / 0.10), 0 1px 2px rgb(0 0 0 / 0.06)",
    3: "0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)",
    4: "0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)",
    6: "0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.10)",
    8: "0 25px 50px -12px rgb(0 0 0 / 0.20)",
    12: "0 35px 60px -15px rgb(0 0 0 / 0.22)",
    16: "0 45px 80px -20px rgb(0 0 0 / 0.25)",
    24: "0 60px 100px -25px rgb(0 0 0 / 0.30)",
  },
  motion: {
    fast: "120ms",
    normal: "200ms",
    slow: "320ms",
    easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
    easingIn: "cubic-bezier(0.4, 0, 1, 1)",
    easingOut: "cubic-bezier(0, 0, 0.2, 1)",
  },
  zIndex: {
    base: "0",
    dropdown: "100",
    sticky: "200",
    navigation: "250",
    overlay: "300",
    modal: "400",
    popover: "500",
    toast: "600",
    tooltip: "700",
  },
};
