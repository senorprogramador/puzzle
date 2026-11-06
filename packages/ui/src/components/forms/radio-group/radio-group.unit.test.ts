import { describe, expect, it } from "vitest";

import { mergeDescribedBy, resolveRadioGroupError } from "./radio-group.utils";

describe("mergeDescribedBy", () => {
  it("returns undefined without IDs", () => {
    expect(mergeDescribedBy()).toBeUndefined();
  });

  it("combines multiple IDs", () => {
    expect(mergeDescribedBy("description", "error")).toBe("description error");
  });

  it("removes duplicate IDs", () => {
    expect(mergeDescribedBy("description error", "description", "help")).toBe(
      "description error help",
    );
  });

  it("ignores empty strings and normalizes whitespace", () => {
    expect(mergeDescribedBy("  description  ", "", "error")).toBe(
      "description error",
    );
  });
});

describe("resolveRadioGroupError", () => {
  it("does not mark a group invalid without an error", () => {
    expect(resolveRadioGroupError(undefined)).toEqual({
      isInvalid: false,
      errorContent: undefined,
      hasError: false,
    });
  });

  it("marks the group invalid when an error exists", () => {
    expect(resolveRadioGroupError("Select an option")).toEqual({
      isInvalid: true,
      errorContent: "Select an option",
      hasError: true,
    });
  });

  it("uses a default message for boolean errors", () => {
    expect(resolveRadioGroupError(true)).toEqual({
      isInvalid: true,
      errorContent: "Invalid value",
      hasError: true,
    });
  });

  it("allows invalid to override the inferred state", () => {
    expect(resolveRadioGroupError("Invalid choice", false)).toEqual({
      isInvalid: false,
      errorContent: "Invalid choice",
      hasError: false,
    });
  });

  it("supports invalid state without a visible error message", () => {
    expect(resolveRadioGroupError(undefined, true)).toEqual({
      isInvalid: true,
      errorContent: undefined,
      hasError: false,
    });
  });
});
