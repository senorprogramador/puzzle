export const isHexColor = (color: string): boolean => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

import { hexToRgb } from "./to-color";

const linearize = (value: number): number => {
  const channel = value / 255;

  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
};

/** Returns whether a color is dark based on WCAG relative luminance. */
export const isDarkColor = (color: string): boolean => {
  const { r, g, b } = hexToRgb(color);

  const luminance =
    0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);

  return luminance < 0.179;
};
