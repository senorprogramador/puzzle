export type ColorType =
  | "hex"
  | "hexa"
  | "rgb"
  | "rgba"
  | "hsl"
  | "hsla"
  | "named"
  | "css-variable"
  | "unknown";

export type RGBColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type HSLColor = {
  h: number;
  s: number;
  l: number;
  a: number;
};
