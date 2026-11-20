import { describe, expect, it } from "vitest";

import {
  GOOGLE_FONT_FAMILIES,
  createGoogleFontUrl,
  type GoogleFontFamily,
} from "../index";

describe("public Google Font catalog", () => {
  it("is readonly, unique, and alphabetically sorted", () => {
    const families: readonly GoogleFontFamily[] = GOOGLE_FONT_FAMILIES;

    expect(families.length).toBeGreaterThan(0);
    expect(new Set(families).size).toBe(families.length);
    expect(families).toEqual(
      [...families].sort(
        (left, right) =>
          left.localeCompare(right, "en", { sensitivity: "base" }) ||
          left.localeCompare(right, "en"),
      ),
    );
  });

  it("supports URL generation for every exported family", () => {
    for (const family of GOOGLE_FONT_FAMILIES) {
      const url = new URL(createGoogleFontUrl({ family, weights: [400] }));

      expect(url.origin).toBe("https://fonts.googleapis.com");
      expect(url.searchParams.get("family")).toBe(`${family}:wght@400`);
      expect(url.searchParams.get("display")).toBe("swap");
    }
  });
});
