import type { Breakpoint, ResponsiveConfig, ResponsiveValue } from "./types";

const resolveResponsiveValueForBreakpoint = <T>(
  breakpoint: Breakpoint,
  value: ResponsiveValue<T>,
  fallback?: T,
): T => {
  if (value === undefined || value === null) {
    return fallback as T;
  }
  const isNonResponsive = typeof value !== "object" || !(breakpoint in value);
  const resolved = isNonResponsive
    ? ((value ?? fallback) as T)
    : ((value as ResponsiveConfig<T>)[breakpoint] ?? (fallback as T));
  return resolved;
};

const resolveResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  fallback?: T,
): Required<ResponsiveConfig<T>> => {
  const mobile = resolveResponsiveValueForBreakpoint("mobile", value, fallback);
  const tablet = resolveResponsiveValueForBreakpoint("tablet", value, mobile);
  const desktop = resolveResponsiveValueForBreakpoint("desktop", value, tablet);

  return {
    mobile,
    tablet,
    desktop,
  };
};

export { resolveResponsiveValue, resolveResponsiveValueForBreakpoint };
export { BREAKPOINTS } from "./constants";
export type { Breakpoint, ResponsiveConfig, ResponsiveValue } from "./types";
