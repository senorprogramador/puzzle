import type { ThemeTypographyRoleTokens, TypographyStyle } from "../types";

export type { TypographyStyle } from "../types";

export const typographyDefaults = {
  display1: {
    size: 80,
    lineHeight: 1.05,
    weight: 300,
    letterSpacing: -1.5,
    font: "heading",
    responsive: {
      min: 40,
      max: 80,
      minViewport: 360,
      maxViewport: 1440,
    },
  },
  display2: {
    size: 60,
    lineHeight: 1.1,
    weight: 300,
    letterSpacing: -0.5,
    font: "heading",
    responsive: {
      min: 36,
      max: 60,
      minViewport: 360,
      maxViewport: 1200,
    },
  },
  headline1: {
    size: 48,
    lineHeight: 1.15,
    weight: 400,
    letterSpacing: -0.5,
    font: "heading",
    responsive: {
      min: 32,
      max: 48,
      minViewport: 360,
      maxViewport: 1200,
    },
  },
  headline2: {
    size: 36,
    lineHeight: 1.2,
    weight: 400,
    letterSpacing: -0.25,
    font: "heading",
    responsive: {
      min: 28,
      max: 36,
      minViewport: 360,
      maxViewport: 1024,
    },
  },
  headline3: {
    size: 28,
    lineHeight: 1.25,
    weight: 400,
    letterSpacing: 0,
    font: "heading",
    responsive: {
      min: 22,
      max: 28,
      minViewport: 360,
      maxViewport: 900,
    },
  },
  headline4: {
    size: 20,
    lineHeight: 1.3,
    weight: 500,
    letterSpacing: 0.15,
    font: "heading",
  },
  subtitle1: {
    size: 16,
    lineHeight: 1.5,
    weight: 500,
    letterSpacing: 0.15,
    font: "heading",
  },
  subtitle2: {
    size: 14,
    lineHeight: 1.43,
    weight: 500,
    letterSpacing: 0.1,
    font: "heading",
  },
  body1: {
    size: 16,
    lineHeight: 1.5,
    weight: 400,
    letterSpacing: 0.5,
    font: "body",
  },
  body2: {
    size: 14,
    lineHeight: 1.43,
    weight: 400,
    letterSpacing: 0.25,
    font: "body",
  },
  button: {
    size: 14,
    lineHeight: 1.43,
    weight: 500,
    letterSpacing: 0.5,
    font: "body",
  },
  caption: {
    size: 12,
    lineHeight: 1.4,
    weight: 400,
    letterSpacing: 0.4,
    font: "body",
  },
  overline: {
    size: 10,
    lineHeight: 1.6,
    weight: 500,
    letterSpacing: 1,
    font: "body",
  },
} as const;

export type ResponsiveFontSize = {
  min: number;
  max: number;
  minViewport?: number;
  maxViewport?: number;
};

export const createFluidFontSize = ({
  min,
  max,
  minViewport = 360,
  maxViewport = 1440,
}: ResponsiveFontSize): string => {
  const minRem = min / 16;
  const maxRem = max / 16;

  const slope = ((max - min) / (maxViewport - minViewport)) * 100;
  const intercept = (min - (slope * minViewport) / 100) / 16;

  return `clamp(${minRem}rem, ${intercept.toFixed(4)}rem + ${slope.toFixed(4)}vw, ${maxRem}rem)`;
};

const fontSizeScaleByRole: Partial<Record<TypographyStyle, string>> = {
  headline4: "xl",
  subtitle1: "base",
  subtitle2: "sm",
  body1: "base",
  body2: "sm",
  button: "sm",
  caption: "xs",
};

const fontWeightTokenByValue = new Map<number, string>([
  [400, "normal"],
  [500, "medium"],
  [600, "semibold"],
  [700, "bold"],
  [800, "extrabold"],
]);

const lineHeightTokenByValue = new Map<number, string>([
  [1, "none"],
  [1.15, "tight"],
  [1.3, "snug"],
  [1.5, "normal"],
  [1.625, "relaxed"],
  [2, "loose"],
]);

const createTypographyRole = (
  name: TypographyStyle,
  typography: (typeof typographyDefaults)[TypographyStyle],
): ThemeTypographyRoleTokens => {
  const fontSizeScale = fontSizeScaleByRole[name];
  const fontWeightToken = fontWeightTokenByValue.get(typography.weight);
  const lineHeightToken = lineHeightTokenByValue.get(typography.lineHeight);

  return {
    font: typography.font,

    fontSize:
      fontSizeScale !== undefined
        ? `var(--puzzle-font-size-${fontSizeScale})`
        : "responsive" in typography
          ? createFluidFontSize(typography.responsive)
          : `${typography.size / 16}rem`,

    fontWeight:
      fontWeightToken !== undefined
        ? `var(--puzzle-font-weight-${fontWeightToken})`
        : String(typography.weight),

    lineHeight:
      lineHeightToken !== undefined
        ? `var(--puzzle-font-line-height-${lineHeightToken})`
        : String(typography.lineHeight),

    letterSpacing: `${typography.letterSpacing / typography.size}em`,
  };
};

export const DEFAULT_TYPOGRAPHY_ROLES = Object.fromEntries(
  Object.entries(typographyDefaults).map(([name, typography]) => [
    name,
    createTypographyRole(
      name as TypographyStyle,
      typography as (typeof typographyDefaults)[TypographyStyle],
    ),
  ]),
) as Record<TypographyStyle, ThemeTypographyRoleTokens>;
