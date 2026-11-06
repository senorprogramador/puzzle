import { describe, expect, it } from "vitest";
import { getProgressAriaProps, normalizeProgressValue } from "./utils";

describe("normalizeProgressValue", () => {
  it.each([
    [0, 0],
    [42, 42],
    [100, 100],
    [-5, 0],
    [250, 100],
  ])("clamps %s to %s", (input, expected) => {
    expect(normalizeProgressValue(input)).toBe(expected);
  });

  it.each([undefined, Number.NaN, Infinity, -Infinity])(
    "treats %s as indeterminate",
    (input) => {
      expect(normalizeProgressValue(input)).toBeUndefined();
    },
  );
});

describe("getProgressAriaProps", () => {
  it("describes a determinate progressbar", () => {
    expect(getProgressAriaProps(30)).toEqual({
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": 30,
    });
  });

  it("leaves aria-valuenow undefined while indeterminate", () => {
    expect(getProgressAriaProps(undefined)["aria-valuenow"]).toBeUndefined();
  });
});
