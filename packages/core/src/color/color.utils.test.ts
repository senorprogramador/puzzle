import { describe, expect, it } from "vitest";

import {
  getColorType,
  isColor,
  isCssVariable,
  hexToRgba,
  parseColor,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  isColorDark,
  getColorLuminance,
} from "./color.utils";

describe("Color utilities", () => {
  describe("getColorType", () => {
    it.each([
      ["#fff", "hex"],
      ["#ffffff", "hex"],
      ["#ffff", "hexa"],
      ["#ffffffff", "hexa"],
      ["rgb(255, 0, 0)", "rgb"],
      ["rgba(255, 0, 0, 0.5)", "rgba"],
      ["hsl(120, 100%, 50%)", "hsl"],
      ["hsla(120, 100%, 50%, 0.5)", "hsla"],
      ["var(--primary)", "css-variable"],
      ["red", "named"],
      ["invalid-color", "unknown"],
    ] as const)("%s is classified as %s", (color, expected) => {
      expect(getColorType(color)).toBe(expected);
    });
  });

  it("recognizes CSS variables", () => {
    expect(isCssVariable("var(--primary)")).toBe(true);
    expect(isCssVariable("#fff")).toBe(false);
  });

  it("recognizes supported color syntaxes", () => {
    expect(isColor("#fff")).toBe(true);
    expect(isColor("rgb(1, 2, 3)")).toBe(true);
    expect(isColor("var(--primary)")).toBe(true);
    expect(isColor("red")).toBe(true);
    expect(isColor("invalid")).toBe(false);
    expect(isColor("invalid-color")).toBe(false);
  });

  it("parses short HEX", () => {
    expect(hexToRgba("#f00")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    });
  });

  it("parses HEX with alpha", () => {
    expect(hexToRgba("#ff000080")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 128 / 255,
    });
  });

  it("converts RGB to HEX", () => {
    expect(rgbToHex(255, 128, 0)).toBe("#ff8000");
  });

  it("parses RGB", () => {
    expect(parseColor("rgb(255, 0, 0)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    });
  });

  it("parses HSL", () => {
    expect(parseColor("hsl(0, 100%, 50%)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    });
  });

  it("does not resolve CSS variables in core", () => {
    expect(parseColor("var(--primary)")).toBeNull();
  });

  it("converts RGB to HSL and back", () => {
    const rgb = {
      r: 255,
      g: 128,
      b: 0,
      a: 1,
    };

    const result = hslToRgb(rgbToHsl(rgb));

    expect(result.r).toBeCloseTo(rgb.r, 0);
    expect(result.g).toBeCloseTo(rgb.g, 0);
    expect(result.b).toBeCloseTo(rgb.b, 0);
  });

  it("calculates luminance", () => {
    expect(getColorLuminance("#000")).toBe(0);
    expect(getColorLuminance("#fff")).toBe(1);
  });

  it("detects dark and light colors", () => {
    expect(isColorDark("#000")).toBe(true);
    expect(isColorDark("#fff")).toBe(false);
  });

  it("returns null for unsupported luminance", () => {
    expect(getColorLuminance("var(--primary)")).toBeNull();
    expect(isColorDark("var(--primary)")).toBeNull();
  });
});
