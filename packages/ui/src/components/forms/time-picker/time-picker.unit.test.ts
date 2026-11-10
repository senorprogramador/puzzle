import { describe, expect, it } from "vitest";

import {
  isTimeWithinBounds,
  isValidTime,
  normalizeTime,
  parseTime,
} from "./time-picker.utils";

describe("TimePicker utilities", () => {
  describe("parseTime", () => {
    it("parses hours and minutes", () => {
      expect(parseTime("09:30")).toBe(34200);
      expect(parseTime("00:00")).toBe(0);
      expect(parseTime("23:59")).toBe(86340);
    });

    it("parses seconds", () => {
      expect(parseTime("09:30:45")).toBe(34245);
    });

    it("rejects invalid values", () => {
      expect(parseTime("24:00")).toBeNull();
      expect(parseTime("12:60")).toBeNull();
      expect(parseTime("12:30:60")).toBeNull();
      expect(parseTime("9:30")).toBeNull();
      expect(parseTime("invalid")).toBeNull();
      expect(parseTime("")).toBeNull();
      expect(parseTime(null)).toBeNull();
    });
  });

  describe("isValidTime", () => {
    it("accepts valid and empty values", () => {
      expect(isValidTime("09:30")).toBe(true);
      expect(isValidTime("09:30:15")).toBe(true);
      expect(isValidTime("")).toBe(true);
      expect(isValidTime(null)).toBe(true);
    });

    it("rejects invalid values", () => {
      expect(isValidTime("25:00")).toBe(false);
      expect(isValidTime("12:90")).toBe(false);
    });
  });

  describe("normalizeTime", () => {
    it("normalizes values without seconds", () => {
      expect(normalizeTime("09:30")).toBe("09:30");
      expect(normalizeTime("09:30:45")).toBe("09:30");
    });

    it("preserves seconds when requested", () => {
      expect(normalizeTime("09:30", true)).toBe("09:30:00");
      expect(normalizeTime("09:30:45", true)).toBe("09:30:45");
    });

    it("returns null for empty or invalid values", () => {
      expect(normalizeTime(null)).toBeNull();
      expect(normalizeTime("")).toBeNull();
      expect(normalizeTime("invalid")).toBeNull();
    });
  });

  describe("isTimeWithinBounds", () => {
    it("accepts values within inclusive bounds", () => {
      expect(isTimeWithinBounds("09:00", "09:00", "17:00")).toBe(true);

      expect(isTimeWithinBounds("17:00", "09:00", "17:00")).toBe(true);

      expect(isTimeWithinBounds("12:30", "09:00", "17:00")).toBe(true);
    });

    it("rejects values outside bounds", () => {
      expect(isTimeWithinBounds("08:59", "09:00", "17:00")).toBe(false);

      expect(isTimeWithinBounds("17:01", "09:00", "17:00")).toBe(false);
    });

    it("supports a single bound", () => {
      expect(isTimeWithinBounds("10:00", "09:00")).toBe(true);
      expect(isTimeWithinBounds("08:00", "09:00")).toBe(false);
      expect(isTimeWithinBounds("10:00", undefined, "11:00")).toBe(true);
    });

    it("rejects an inverted range", () => {
      expect(isTimeWithinBounds("12:00", "17:00", "09:00")).toBe(false);
    });
  });
});
