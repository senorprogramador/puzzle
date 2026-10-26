export const typographyDefaults = {
  // Display — hero titles and prominent marketing content
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

  // Headlines — page and section headings
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

  // Subtitles
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

  // Body text
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

  // Interactive elements
  button: {
    size: 14,
    lineHeight: 1.43,
    weight: 500,
    letterSpacing: 0.5,
    font: "body",
  },

  // Supporting text
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

export type TypographyStyle = keyof typeof typographyDefaults;
export type ResponsiveFontSize = {
  min: number;
  max: number;
  minViewport?: number;
  maxViewport?: number;
};

export function createFluidFontSize({
  min,
  max,
  minViewport = 360,
  maxViewport = 1440,
}: ResponsiveFontSize): string {
  const minRem = min / 16;
  const maxRem = max / 16;

  const slope = ((max - min) / (maxViewport - minViewport)) * 100;

  const intercept = (min - (slope * minViewport) / 100) / 16;

  return `clamp(${minRem}rem, ${intercept.toFixed(4)}rem + ${slope.toFixed(4)}vw, ${maxRem}rem)`;
}
