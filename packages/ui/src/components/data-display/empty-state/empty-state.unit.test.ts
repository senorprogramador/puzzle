import { describe, expect, it } from "vitest";
import { getEmptyStateClasses } from "./empty-state.utils";

describe("getEmptyStateClasses", () => {
  it("returns the default size and variant classes", () => {
    expect(getEmptyStateClasses("md", "default")).toBe(
      "puzzle-empty-state puzzle-empty-state--md puzzle-empty-state--default",
    );
  });

  it("supports all sizes", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      expect(getEmptyStateClasses(size, "default")).toContain(
        `puzzle-empty-state--${size}`,
      );
    }
  });

  it("supports all variants", () => {
    for (const variant of ["default", "outlined", "filled"] as const) {
      expect(getEmptyStateClasses("md", variant)).toContain(
        `puzzle-empty-state--${variant}`,
      );
    }
  });

  it("merges custom classes", () => {
    expect(getEmptyStateClasses("lg", "outlined", "custom-empty")).toContain(
      "custom-empty",
    );
  });
});
