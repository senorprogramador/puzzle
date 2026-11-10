import { describe, expect, it } from "vitest";
import { getSeparatorSemantics } from "./separator.utils";

describe("getSeparatorSemantics", () => {
  it("returns decorative semantics by default when requested", () => {
    expect(getSeparatorSemantics("horizontal", true)).toEqual({
      role: "none",
    });
  });

  it("returns decorative semantics for vertical separators", () => {
    expect(getSeparatorSemantics("vertical", true)).toEqual({
      role: "none",
    });
  });

  it("returns horizontal separator semantics", () => {
    expect(getSeparatorSemantics("horizontal", false)).toEqual({
      role: "separator",
    });
  });

  it("returns vertical separator semantics", () => {
    expect(getSeparatorSemantics("vertical", false)).toEqual({
      role: "separator",
      "aria-orientation": "vertical",
    });
  });
});
