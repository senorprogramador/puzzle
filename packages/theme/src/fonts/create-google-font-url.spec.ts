import { describe, expect, it } from "vitest";
import { createGoogleFontUrl } from "./create-google-font-url";
import { resolveFontStylesheets } from "./resolve-font-stylesheets";

function getFamily(url: string): string | null {
  return new URL(url).searchParams.get("family");
}

describe("createGoogleFontUrl", () => {
  it("requests variable weights for both styles", () => {
    expect(getFamily(createGoogleFontUrl({
      family: "Geist",
      weightRange: [300, 700],
      styles: ["italic", "normal"],
    }))).toBe("Geist:ital,wght@0,300..700;1,300..700");
    expect(getFamily(createGoogleFontUrl({
      family: "Geist",
      weightRange: [300, 700],
    }))).toBe("Geist:wght@300..700");
  });

  it.each([[700, 300], [0, 700], [300, 1001], [300.5, 700]])(
    "rejects invalid range %s..%s",
    (start, end) => {
      expect(() => createGoogleFontUrl({
        family: "Geist",
        weightRange: [start, end],
      })).toThrow(RangeError);
    },
  );

  it("merges ranges and discrete weights across roles", () => {
    const sheets = resolveFontStylesheets({
      heading: { family: "Geist", weightRange: [300, 600] },
      body: { family: "Geist", weightRange: [400, 700] },
      accent: { family: "Geist", weights: [800] },
    });
    expect(sheets).toHaveLength(1);
    expect(getFamily(sheets[0]!.href)).toBe("Geist:wght@300..800");
  });

  it("uses the default weights and display", () => {
    const url = createGoogleFontUrl({
      family: "Inter",
    });

    expect(getFamily(url)).toBe("Inter:wght@400;700");
    expect(new URL(url).searchParams.get("display")).toBe("swap");
  });

  it("sorts and deduplicates weights", () => {
    const url = createGoogleFontUrl({
      family: "Inter",
      weights: [700, 400, 700, 500],
    });

    expect(getFamily(url)).toBe("Inter:wght@400;500;700");
  });

  it("supports normal and italic styles", () => {
    const url = createGoogleFontUrl({
      family: "Inter",
      weights: [700, 400],
      styles: ["italic", "normal"],
    });

    expect(getFamily(url)).toBe("Inter:ital,wght@0,400;0,700;1,400;1,700");
  });

  it("supports italic-only requests", () => {
    const url = createGoogleFontUrl({
      family: "Inter",
      weights: [400],
      styles: ["italic"],
    });

    expect(getFamily(url)).toBe("Inter:ital,wght@1,400");
  });

  it("encodes family names with spaces", () => {
    const url = createGoogleFontUrl({
      family: "Cormorant Garamond",
      weights: [400, 600],
    });

    expect(getFamily(url)).toBe("Cormorant Garamond:wght@400;600");
  });

  it("supports custom display values", () => {
    const url = createGoogleFontUrl({
      family: "Inter",
      display: "optional",
    });

    expect(new URL(url).searchParams.get("display")).toBe("optional");
  });

  it("rejects invalid weights", () => {
    expect(() =>
      createGoogleFontUrl({
        family: "Inter",
        weights: [400, 1200],
      }),
    ).toThrow(RangeError);
  });

  it("rejects an empty family", () => {
    expect(() =>
      createGoogleFontUrl({
        // @ts-expect-error Exercise runtime validation of an invalid family.
        family: " ",
      }),
    ).toThrow(TypeError);
  });

  it("rejects an empty weights array", () => {
    expect(() =>
      createGoogleFontUrl({
        family: "Inter",
        weights: [],
      }),
    ).toThrow(RangeError);
  });

  it("rejects an empty styles array", () => {
    expect(() =>
      createGoogleFontUrl({
        family: "Inter",
        styles: [],
      }),
    ).toThrow(TypeError);
  });
});
