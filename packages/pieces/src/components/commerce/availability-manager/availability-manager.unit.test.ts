import { describe, expect, it } from "vitest";
import {
  addCalendarDays,
  calendarDayDifference,
  cellsForRange,
  toDateKey,
} from "./availability-manager.utils";

describe("availability manager date helpers", () => {
  it("uses local date-only arithmetic across daylight-saving boundaries", () => {
    const start = new Date(2025, 2, 29);
    const next = addCalendarDays(start, 1);

    expect(toDateKey(next)).toBe("2025-03-30");
    expect(calendarDayDifference(start, next)).toBe(1);
  });

  it("creates an inclusive resource range without changing the input dates", () => {
    const start = new Date(2025, 5, 2, 18);
    const end = new Date(2025, 5, 4, 8);
    const cells = cellsForRange("room", start, end);

    expect(cells.map((cell) => toDateKey(cell.date))).toEqual([
      "2025-06-02",
      "2025-06-03",
      "2025-06-04",
    ]);
    expect(start.getHours()).toBe(18);
    expect(end.getHours()).toBe(8);
  });
});
