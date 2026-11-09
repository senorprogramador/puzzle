import { describe, expect, it } from "vitest";

import {
  hsvToRgb,
  rgbToHsv,
  hsvToFormat,
  parseColorToHsv,
} from "./color-picker.utils";

describe("ColorPicker utilities", () => {
  it("converts RGB to HSV", () => {
    expect(
      rgbToHsv({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      }),
    ).toEqual({
      h: 0,
      s: 100,
      v: 100,
      a: 1,
    });
  });

  it("converts HSV to RGB", () => {
    expect(
      hsvToRgb({
        h: 120,
        s: 100,
        v: 100,
        a: 1,
      }),
    ).toEqual({
      r: 0,
      g: 255,
      b: 0,
      a: 1,
    });
  });

  it("converts HSV into HEX", () => {
    expect(
      hsvToFormat(
        {
          h: 0,
          s: 100,
          v: 100,
          a: 1,
        },
        "hex",
      ),
    ).toBe("#ff0000");
  });

  it("converts HSV into HEX with alpha", () => {
    expect(
      hsvToFormat(
        {
          h: 0,
          s: 100,
          v: 100,
          a: 0.5,
        },
        "hexa",
      ),
    ).toBe("#ff000080");
  });

  it("parses HEX colors", () => {
    expect(parseColorToHsv("#ff0000")).toEqual({
      h: 0,
      s: 100,
      v: 100,
      a: 1,
    });
  });

  it("returns null for unsupported CSS variables in pure utility", () => {
    expect(parseColorToHsv("var(--primary)")).toBeNull();
  });

  it("round trips RGB through HSV", () => {
    const rgb = {
      r: 25,
      g: 125,
      b: 200,
      a: 1,
    };

    const result = hsvToRgb(rgbToHsv(rgb));

    expect(result.r).toBeCloseTo(rgb.r, 0);
    expect(result.g).toBeCloseTo(rgb.g, 0);
    expect(result.b).toBeCloseTo(rgb.b, 0);
  });
});
