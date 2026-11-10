import { describe, expect, it } from "vitest";

import {
  getNextRating,
  getRatingStarState,
  normalizeRating,
} from "./rating.utils";

describe("rating utilities", () => {
  describe("normalizeRating", () => {
    it("clamps values to the supported range", () => {
      expect(normalizeRating(-2, 5, 0.5)).toBe(0);
      expect(normalizeRating(8, 5, 0.5)).toBe(5);
    });

    it("rounds values to the configured precision", () => {
      expect(normalizeRating(3.24, 5, 0.5)).toBe(3);
      expect(normalizeRating(3.26, 5, 0.5)).toBe(3.5);
      expect(normalizeRating(3.7, 5, 1)).toBe(4);
    });

    it("normalizes non-finite values to zero", () => {
      expect(normalizeRating(Number.NaN, 5, 0.5)).toBe(0);

      expect(normalizeRating(Number.POSITIVE_INFINITY, 5, 0.5)).toBe(0);
    });
  });

  describe("getRatingStarState", () => {
    it("returns full, half and empty states", () => {
      expect(getRatingStarState(3.5, 0)).toBe("full");
      expect(getRatingStarState(3.5, 3)).toBe("half");
      expect(getRatingStarState(3.5, 4)).toBe("empty");
    });
  });

  describe("getNextRating", () => {
    it("increments and decrements with configured precision", () => {
      expect(getNextRating(2, "ArrowRight", 5, 0.5)).toBe(2.5);
      expect(getNextRating(2, "ArrowUp", 5, 1)).toBe(3);
      expect(getNextRating(2, "ArrowLeft", 5, 0.5)).toBe(1.5);
      expect(getNextRating(2, "ArrowDown", 5, 1)).toBe(1);
    });

    it("supports Home and End", () => {
      expect(getNextRating(2, "Home", 5, 0.5)).toBe(0);
      expect(getNextRating(2, "End", 5, 0.5)).toBe(5);
    });

    it("ignores unsupported keys", () => {
      expect(getNextRating(2, "Enter", 5, 0.5)).toBeUndefined();
    });

    it("does not exceed the range", () => {
      expect(getNextRating(5, "ArrowRight", 5, 0.5)).toBe(5);
      expect(getNextRating(0, "ArrowLeft", 5, 0.5)).toBe(0);
    });
  });
});
