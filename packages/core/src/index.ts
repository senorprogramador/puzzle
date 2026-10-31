export { type DeepPartial } from "./types";
export {
  BREAKPOINTS,
  resolveResponsiveValue,
  resolveResponsiveValueForBreakpoint,
  type ResponsiveConfig,
  type ResponsiveValue,
  type Breakpoint,
} from "./responsive";

/** String utilities */
export {
  assertSafeCssValue,
  stringWithCasing,
  normalizeSearchString,
  withSafeCharacters,
  escapeCssString,
  cn,
  type ClassnameArg,
  nameToInitials,
} from "./string";

/** Color utilities */
export { isHexColor, isDarkColor } from "./color/is-color";
export { hexToRgb, rgbToHex } from "./color/to-color";

/** Timing utilities */
export { debounce } from "./timing/debounce";
