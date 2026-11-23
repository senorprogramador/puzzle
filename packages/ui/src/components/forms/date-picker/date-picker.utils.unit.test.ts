import { describe, expect, it } from "vitest";
import { addDays, addMonths, startOfDay, toDateKey } from "./date-picker.utils";

const createDateWithYear = (year: number, month: number, day: number) => {
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

describe("DatePicker calendar arithmetic", () => {
  it("preserves years below 100 when normalizing and moving dates", () => {
    const date = createDateWithYear(99, 1, 31);

    expect(toDateKey(startOfDay(date))).toBe("0099-01-31");
    expect(toDateKey(addDays(date, 1))).toBe("0099-02-01");
    expect(toDateKey(addMonths(date, 1))).toBe("0099-02-28");
  });
});
