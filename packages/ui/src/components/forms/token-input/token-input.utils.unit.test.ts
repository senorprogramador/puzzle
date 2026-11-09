import { describe, expect, it } from "vitest";

import {
  sanitizeToken,
  getNextActiveIndex,
  getPreviousActiveIndex,
  isTokenComplete,
  removeTokenCharacter,
  replaceTokenCharacter,
  insertTokenCharacters,
} from "./token-input.utils";

describe("TokenInput utilities", () => {
  describe("sanitizeToken", () => {
    it("allows numeric characters by default", () => {
      expect(sanitizeToken("12a34b", 6)).toBe("1234");
    });

    it("preserves leading zeroes", () => {
      expect(sanitizeToken("012345", 6)).toBe("012345");
    });

    it("limits the value to the configured length", () => {
      expect(sanitizeToken("12345678", 6)).toBe("123456");
    });

    it("removes whitespace and special characters", () => {
      expect(sanitizeToken("12 34-56", 6)).toBe("123456");
    });

    it("supports alphanumeric values", () => {
      expect(sanitizeToken("Ab12-Cd34", 8, "alphanumeric")).toBe("Ab12Cd34");
    });

    it("preserves character casing", () => {
      expect(sanitizeToken("aBcDeF", 6, "alphanumeric")).toBe("aBcDeF");
    });

    it("rejects non-numeric characters in numeric mode", () => {
      expect(sanitizeToken("abcdef", 6)).toBe("");
    });

    it("returns an empty string for empty input", () => {
      expect(sanitizeToken("", 6)).toBe("");
    });

    it("supports a length of one", () => {
      expect(sanitizeToken("123", 1)).toBe("1");
    });

    it("returns an empty string for a zero length", () => {
      expect(sanitizeToken("123", 0)).toBe("");
    });
  });

  describe("getNextActiveIndex", () => {
    it("returns the next empty position", () => {
      expect(getNextActiveIndex("123", 6)).toBe(3);
    });

    it("returns the final position for a complete value", () => {
      expect(getNextActiveIndex("123456", 6)).toBe(5);
    });

    it("returns the first position for an empty value", () => {
      expect(getNextActiveIndex("", 6)).toBe(0);
    });

    it("does not exceed the configured length", () => {
      expect(getNextActiveIndex("12345678", 6)).toBe(5);
    });

    it("supports a single character token", () => {
      expect(getNextActiveIndex("", 1)).toBe(0);
      expect(getNextActiveIndex("1", 1)).toBe(0);
    });
  });

  describe("getPreviousActiveIndex", () => {
    it("returns the previous position", () => {
      expect(getPreviousActiveIndex(3)).toBe(2);
    });

    it("does not return a negative index", () => {
      expect(getPreviousActiveIndex(0)).toBe(0);
    });
  });

  describe("isTokenComplete", () => {
    it("returns true for a complete token", () => {
      expect(isTokenComplete("123456", 6)).toBe(true);
    });

    it("returns false for an incomplete token", () => {
      expect(isTokenComplete("12345", 6)).toBe(false);
    });

    it("returns false for an empty token", () => {
      expect(isTokenComplete("", 6)).toBe(false);
    });

    it("supports a one-character token", () => {
      expect(isTokenComplete("1", 1)).toBe(true);
    });
  });

  describe("removeTokenCharacter", () => {
    it("removes a character at the specified position", () => {
      expect(removeTokenCharacter("123456", 2)).toBe("12456");
    });

    it("removes the first character", () => {
      expect(removeTokenCharacter("123456", 0)).toBe("23456");
    });

    it("removes the last character", () => {
      expect(removeTokenCharacter("123456", 5)).toBe("12345");
    });
  });

  describe("replaceTokenCharacter", () => {
    it("replaces a character at the specified position", () => {
      expect(replaceTokenCharacter("123456", 2, "9", 6, "numeric")).toBe(
        "129456",
      );
    });

    it("removes the character when given an empty value", () => {
      expect(replaceTokenCharacter("123456", 2, "", 6, "numeric")).toBe(
        "12456",
      );
    });

    it("removes invalid numeric characters", () => {
      expect(replaceTokenCharacter("123456", 2, "a", 6, "numeric")).toBe(
        "12456",
      );
    });

    it("supports alphanumeric replacement", () => {
      expect(replaceTokenCharacter("Ab12Cd", 2, "X", 6, "alphanumeric")).toBe(
        "AbX2Cd",
      );
    });
  });

  describe("insertTokenCharacters", () => {
    it("inserts multiple characters at the specified position", () => {
      expect(insertTokenCharacters("123456", 2, "99", 6, "numeric")).toBe(
        "129956",
      );
    });

    it("replaces a single character instead of shifting the value", () => {
      expect(insertTokenCharacters("123456", 2, "9", 6, "numeric")).toBe(
        "129456",
      );
    });

    it("replaces the entire token when inserting a complete token", () => {
      expect(insertTokenCharacters("123456", 3, "987654", 6, "numeric")).toBe(
        "987654",
      );
    });

    it("supports complete token autofill from the final position", () => {
      expect(insertTokenCharacters("123456", 5, "987654", 6, "numeric")).toBe(
        "987654",
      );
    });

    it("truncates the result to the configured length", () => {
      expect(insertTokenCharacters("123456", 2, "99999999", 6, "numeric")).toBe(
        "999999",
      );
    });

    it("supports alphanumeric insertion", () => {
      expect(insertTokenCharacters("Ab12Cd", 2, "XY", 6, "alphanumeric")).toBe(
        "AbXYCd",
      );
    });

    it("keeps the value unchanged for an invalid pasted value", () => {
      expect(insertTokenCharacters("123456", 2, "abc", 6, "numeric")).toBe(
        "123456",
      );
    });
  });
});
