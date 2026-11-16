import { describe, expect, it } from "vitest";

import { assertSafeCssValue } from "./assert";

describe("assertSafeCssValue", () => {
  it("accepts and trims non-empty string and number values", () => {
    expect(assertSafeCssValue("  12px  ", "width")).toBe("12px");
    expect(assertSafeCssValue(0, "opacity")).toBe("0");
    expect(assertSafeCssValue(1.5, "scale")).toBe("1.5");
  });

  it.each([null, undefined, true, {}, []])(
    "rejects unsupported input type %s",
    (value) => {
      expect(() => assertSafeCssValue(value, "value")).toThrow(TypeError);
    },
  );

  it.each(["", "  ", "1px; color: red", "url({x})", "<style>", "a\u0000b", "a\u007fb"])(
    "rejects unsafe CSS value %s",
    (value) => {
      expect(() => assertSafeCssValue(value, "width")).toThrow(TypeError);
    },
  );
});
