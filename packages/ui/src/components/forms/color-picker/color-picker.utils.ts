import {
  clamp,
  hslToRgb,
  rgbToHsl,
  parseColor,
  rgbToHex,
  rgbToCss,
  hslToCss,
  type RGBColor,
  type HSLColor,
} from "@puzzle-ui/core";

import type { ColorPickerFormat } from "./color-picker.types";

export type HSVColor = {
  h: number;
  s: number;
  v: number;
  a: number;
};

export const DEFAULT_HSV: HSVColor = {
  h: 0,
  s: 100,
  v: 100,
  a: 1,
};

export const rgbToHsv = ({ r, g, b, a = 1 }: RGBColor): HSVColor => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === red) {
      h = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      h = 60 * ((blue - red) / delta + 2);
    } else {
      h = 60 * ((red - green) / delta + 4);
    }
  }

  return {
    h: (h + 360) % 360,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
    a,
  };
};

export const hsvToRgb = ({ h, s, v, a }: HSVColor): RGBColor => {
  const hue = ((h % 360) + 360) % 360;

  const saturation = clamp(s / 100, 0, 1);
  const value = clamp(v / 100, 0, 1);

  const chroma = value * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = value - chroma;

  let channels: [number, number, number];

  if (hue < 60) channels = [chroma, x, 0];
  else if (hue < 120) channels = [x, chroma, 0];
  else if (hue < 180) channels = [0, chroma, x];
  else if (hue < 240) channels = [0, x, chroma];
  else if (hue < 300) channels = [x, 0, chroma];
  else channels = [chroma, 0, x];

  return {
    r: Math.round((channels[0] + m) * 255),
    g: Math.round((channels[1] + m) * 255),
    b: Math.round((channels[2] + m) * 255),
    a: clamp(a, 0, 1),
  };
};

export const rgbToFormat = (
  rgb: RGBColor,
  format: ColorPickerFormat,
): string => {
  switch (format) {
    case "rgb":
      return rgbToCss(rgb);
    case "hsl":
      return hslToCss(rgbToHsl(rgb));
    case "hexa":
    case "hex":
    default:
      return rgbToHex(rgb.r, rgb.g, rgb.b, rgb.a);
  }
};

export const hsvToFormat = (hsv: HSVColor, format: ColorPickerFormat): string =>
  rgbToFormat(hsvToRgb(hsv), format);

export const parseColorToHsv = (color: string): HSVColor | null => {
  const rgb = parseColor(color);

  return rgb ? rgbToHsv(rgb) : null;
};

export const hslToFormat = (hsl: HSLColor, format: ColorPickerFormat): string =>
  rgbToFormat(hslToRgb(hsl), format);

/**
 * Resolves a CSS color in browser context.
 * Core stays framework/browser independent.
 */
export const resolveCssColor = (color: string): string | null => {
  if (typeof document === "undefined") return null;

  const element = document.createElement("span");

  element.style.color = color;

  if (!element.style.color) return null;

  element.style.position = "absolute";
  element.style.visibility = "hidden";

  document.body.appendChild(element);

  const resolved = getComputedStyle(element).color;

  element.remove();

  return resolved || null;
};

export const parseColorToHsvInBrowser = (color: string): HSVColor | null => {
  const direct = parseColorToHsv(color);

  if (direct) return direct;

  const resolved = resolveCssColor(color);

  return resolved ? parseColorToHsv(resolved) : null;
};
