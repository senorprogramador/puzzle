export const BREAKPOINTS = {
  compact: 480,
  tablet: 768,
  desktop: 1024,
  hd: 1440,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
