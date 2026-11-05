import type { Breakpoint, ResponsiveConfig, ResponsiveValue } from "./types";
declare const resolveResponsiveValueForBreakpoint: <T>(breakpoint: Breakpoint, value: ResponsiveValue<T>, fallback?: T) => T;
declare const resolveResponsiveValue: <T>(value: ResponsiveValue<T>, fallback?: T) => Required<ResponsiveConfig<T>>;
export { resolveResponsiveValue, resolveResponsiveValueForBreakpoint };
export { BREAKPOINTS } from "./constants";
export type { Breakpoint, ResponsiveConfig, ResponsiveValue } from "./types";
