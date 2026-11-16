import { describe, expect, it } from "vitest";

import {
  escapeCssString,
  normalizeSearchString,
  withSafeCharacters,
} from "./normalize";

describe("string normalization", () => {
  it("normalizes search text by removing diacritics and lowercasing", () => {
    expect(normalizeSearchString("  Crème ÉTÉ  ")).toBe("  creme ete  ");
  });

  it("keeps only safe ASCII letters, numbers, whitespace, and hyphens", () => {
    expect(withSafeCharacters("  hello-world!  ")).toBe("hello-world");
    expect(withSafeCharacters("Café")).toBe("Cafe");
    expect(withSafeCharacters("東京")).toBe("");
  });

  it("escapes quotes, backslashes, and CSS string line breaks", () => {
    expect(escapeCssString('"')).toBe('\\"');
    expect(escapeCssString("\\")).toBe("\\\\");
    expect(escapeCssString("\n")).toBe("\\a ");
    expect(escapeCssString("\r")).toBe("\\d ");
    expect(escapeCssString("\f")).toBe("\\c ");
  });

  it("preserves Unicode while escaping special ASCII characters", () => {
    expect(escapeCssString('雪🌟"')).toBe('雪🌟\\"');
    expect(escapeCssString("/")).toBe("/");
  });
});
