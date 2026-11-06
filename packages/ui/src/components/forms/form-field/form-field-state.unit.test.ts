import { describe, expect, it } from "vitest";
import { resolveFormFieldState } from "./form-field-state";

const resolve = (
  input: Partial<Parameters<typeof resolveFormFieldState>[0]> = {},
) => resolveFormFieldState({ generatedId: ":r1:", childProps: {}, ...input });

describe("resolveFormFieldState", () => {
  describe("control id", () => {
    it("falls back to the generated id", () => {
      expect(resolve().resolvedControlId).toBe(":r1:");
    });

    it("uses the child's own id", () => {
      expect(resolve({ childProps: { id: "child" } }).resolvedControlId).toBe(
        "child",
      );
    });

    it("prefers an explicit controlId over the child's id", () => {
      expect(
        resolve({ controlId: "explicit", childProps: { id: "child" } })
          .resolvedControlId,
      ).toBe("explicit");
    });

    it("ignores a non-string child id", () => {
      expect(resolve({ childProps: { id: 5 } }).resolvedControlId).toBe(":r1:");
    });
  });

  describe("invalid state", () => {
    it.each([
      [undefined, undefined, false],
      [null, undefined, false],
      [false, undefined, false],
      ["Oops", undefined, true],
      [true, undefined, true],
      ["Oops", false, false],
      [undefined, true, true],
    ])("error=%s invalid=%s → %s", (error, invalid, expected) => {
      expect(resolve({ error, invalid }).isInvalid).toBe(expected);
    });

    it("uses a default message when error is `true`", () => {
      expect(resolve({ error: true }).errorContent).toBe("Invalid value");
    });

    it("has no error element when invalid without a message", () => {
      const state = resolve({ invalid: true });

      expect(state.isInvalid).toBe(true);
      expect(state.hasError).toBe(false);
      expect(state.errorId).toBeUndefined();
    });

    it("has no error element when invalid is explicitly false", () => {
      expect(resolve({ error: "Oops", invalid: false }).hasError).toBe(false);
    });
  });

  describe("aria-describedby", () => {
    it("is undefined without description, error or existing value", () => {
      expect(resolve().describedBy).toBeUndefined();
    });

    it("derives ids from the control id", () => {
      const state = resolve({
        controlId: "email",
        description: "Help",
        error: "Bad",
      });

      expect(state.descriptionId).toBe("email-description");
      expect(state.errorId).toBe("email-error");
      expect(state.describedBy).toBe("email-description email-error");
    });

    it("keeps existing values first", () => {
      expect(
        resolve({
          controlId: "email",
          description: "Help",
          childProps: { "aria-describedby": "external" },
        }).describedBy,
      ).toBe("external email-description");
    });

    it("ignores a non-string existing value", () => {
      expect(
        resolve({ childProps: { "aria-describedby": 3 } }).describedBy,
      ).toBeUndefined();
    });
  });
});
