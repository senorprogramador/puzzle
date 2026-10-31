import type { BREAKPOINTS } from "./constants";

export type Breakpoint = (typeof BREAKPOINTS)[number];

export type ResponsiveConfig<T> = Omit<
  Partial<Record<(typeof BREAKPOINTS)[number], T>>,
  "mobile"
> & { mobile: T };

export type ResponsiveValue<T> = T | ResponsiveConfig<T> | undefined;
