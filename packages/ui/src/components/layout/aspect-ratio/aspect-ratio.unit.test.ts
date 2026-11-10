import { describe, expect, it } from "vitest";
import { getAspectRatioStyle } from "./aspect-ratio.utils";

describe("getAspectRatioStyle", () => {
  it("returns the requested aspect ratio", () => {
    expect(getAspectRatioStyle(16 / 9)).toEqual({
      aspectRatio: 16 / 9,
    });
  });

  it("preserves additional styles", () => {
    expect(
      getAspectRatioStyle(4 / 3, {
        width: "50%",
        maxWidth: "400px",
      }),
    ).toEqual({
      width: "50%",
      maxWidth: "400px",
      aspectRatio: 4 / 3,
    });
  });

  it("keeps the ratio prop authoritative over custom styles", () => {
    expect(
      getAspectRatioStyle(16 / 9, {
        aspectRatio: 1,
      }),
    ).toEqual({
      aspectRatio: 16 / 9,
    });
  });

  it.each([0, -1, -16 / 9, Infinity, -Infinity, NaN])(
    "rejects invalid ratio %s",
    (ratio) => {
      expect(() => getAspectRatioStyle(ratio)).toThrow(RangeError);
    },
  );
});
