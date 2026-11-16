import { describe, expect, it } from "vitest";

import { hexToRgb, rgbToHex } from "./to-color";

describe("color conversions", () => {
  it("converts short hex values to RGB channels", () => {
    expect(hexToRgb("#0af")).toEqual({ r: 0, g: 170, b: 255 });
    expect(hexToRgb("#abcdef")).toEqual({ r: 171, g: 205, b: 239 });
  });

  it("rejects malformed hexadecimal colors", () => {
    expect(() => hexToRgb("red")).toThrow(/Invalid HEX color/);
    expect(() => hexToRgb("#12")).toThrow(/Invalid HEX color/);
  });

  it("clamps and rounds RGB channels and encodes alpha boundaries", () => {
    expect(rgbToHex(-10, 0.4, 300, 0.5)).toBe("#0000ff80");
    expect(rgbToHex(1, 2, 3, 0)).toBe("#01020300");
    expect(rgbToHex(1, 2, 3, 1)).toBe("#010203");
  });

  it("round-trips channel values through hexadecimal conversion", () => {
    const hex = rgbToHex(12, 128, 254);

    expect(hexToRgb(hex)).toEqual({ r: 12, g: 128, b: 254 });
  });
});
