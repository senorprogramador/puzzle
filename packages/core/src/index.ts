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
export {
  isHexColor,
  isDarkColor,
  getColorType,
  isColor,
  isCssVariable,
  isColorDark,
} from "./color/is-color";

export { hexToRgb, rgbToHex } from "./color/to-color";

export {
  clamp,
  hexToRgba,
  parseRgb,
  parseColor,
  hslToRgb,
  rgbToHsl,
  rgbToCss,
  hslToCss,
  getColorLuminance,
} from "./color/color.utils";

export type { ColorType, RGBColor, HSLColor } from "./color/color.types";

/** Timing utilities */
export { debounce } from "./timing/debounce";
