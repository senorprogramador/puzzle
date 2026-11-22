import { describe, expect, it } from "vitest";
import {
  addDays,
  getLocaleWeekStartsOn,
  toDateKey,
} from "./date-range-picker.utils";

describe("date range calendar utilities", () => {
  it("uses local calendar fields for date keys", () => {
    const date = new Date(2025, 2, 30, 23, 30);
    expect(toDateKey(date)).toBe("2025-03-30");
  });

  it("moves by calendar days across daylight-saving transitions", () => {
    const date = new Date(2025, 2, 29);
    expect(toDateKey(addDays(date, 1))).toBe("2025-03-30");
  });

  it("provides a locale week-start fallback", () => {
    expect(getLocaleWeekStartsOn("en-US")).toBe(0);
    expect(getLocaleWeekStartsOn("en-GB")).toBe(1);
  });
});
