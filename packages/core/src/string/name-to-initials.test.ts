import { describe, expect, it } from "vitest";

import { nameToInitials } from "./name-to-initials";

describe("nameToInitials", () => {
  it("handles empty names and single-word names", () => {
    expect(nameToInitials("")).toBe("?");
    expect(nameToInitials("   ")).toBe("?");
    expect(nameToInitials("  ada  ")).toBe("A");
  });

  it("finds initials around punctuation", () => {
    expect(nameToInitials("Mary-Jane O'Neil")).toBe("MO");
    expect(nameToInitials("(Ada) Lovelace!")).toBe("AL");
  });

  it("ignores surname particles and common suffixes", () => {
    expect(nameToInitials("Ada van der Waals")).toBe("AW");
    expect(nameToInitials("Ada Lovelace, Ph.D.")).toBe("AL");
    expect(nameToInitials("John Smith Jr.")).toBe("JS");
  });

  it("recognizes non-Latin letters", () => {
    expect(nameToInitials("山田 太郎")).toBe("山太");
    expect(nameToInitials("Élodie Noël")).toBe("ÉN");
  });
});
