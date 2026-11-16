import { describe, expect, it } from "vitest";

import { isDarkColor, isHexColor } from "./is-color";

describe("is-color helpers", () => {
  it.each(["#abc", "#abcd", "#abcdef", "#abcdef12", " #ABC "])(
    "accepts valid hex color %s",
    (color) => {
      expect(isHexColor(color)).toBe(true);
    },
  );

  it.each(["", "abc", "#ab", "#abcde", "#abcdefg", "#ggg"])(
    "rejects invalid hex color %s",
    (color) => {
      expect(isHexColor(color)).toBe(false);
    },
  );

  it("classifies supported colors and rejects unsupported formats", () => {
    expect(isDarkColor("#000")).toBe(true);
    expect(isDarkColor("#fff")).toBe(false);
    expect(isDarkColor("#757575")).toBe(true);
    expect(isDarkColor("#767676")).toBe(false);
    expect(() => isDarkColor("var(--primary)")).toThrow(/Unsupported color/);
  });
});
