import { hexToRgba } from "./color.utils";

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const { r, g, b } = hexToRgba(hex);

  return { r, g, b };
};

export const rgbToHex = (
  r: number,
  g: number,
  b: number,
  a?: number,
): string => {
  const channel = (value: number): string =>
    Math.round(Math.min(255, Math.max(0, value)))
      .toString(16)
      .padStart(2, "0");

  const alpha =
    a !== undefined && a < 1 ? channel(Math.min(1, Math.max(0, a)) * 255) : "";

  return `#${channel(r)}${channel(g)}${channel(b)}${alpha}`;
};
