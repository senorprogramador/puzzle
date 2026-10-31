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
export { cn, type ClassnameArg } from "./string/class-names";
export { withSafeCharacters } from "./string/safe-characters";
export { stringWithCasing, type StringCasing } from "./string/casing";
export { escapeCssString } from "./string/escape-css-string";
export { assertSafeCssValue } from "./string/assert-safe-css-value";
export { nameToInitials } from "./string/name-to-initials";

/** Color utilities */
export { isHexColor, isDarkColor } from "./color/is-color";
export { hexToRgb, rgbToHex } from "./color/to-color";

/** Timing utilities */
export { debounce } from "./timing/debounce";
