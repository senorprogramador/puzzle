import { describe, expect, it } from "vitest";
import {
  formatOpeningHoursDate,
  formatOpeningHoursTime,
  formatOpeningHoursWeekday,
  getOpeningHoursStatus,
  validateOpeningHours,
} from "./opening-hours.utils";
import type { OpeningHours } from "./opening-hours-section.types";

const openingHours: OpeningHours = {
  timeZone: "America/New_York",
  days: [
    {
      day: "monday",
      intervals: [
        { opensAt: "11:00", closesAt: "14:00" },
        { opensAt: "17:00", closesAt: "22:00" },
      ],
    },
    { day: "tuesday", intervals: [] },
  ],
};

describe("opening hours utilities", () => {
  it("uses the supplied IANA timezone to derive the venue's local weekday and time", () => {
    expect(
      getOpeningHoursStatus(
        openingHours,
        new Date("2026-01-05T16:30:00.000Z"),
      ),
    ).toBe("open");
    expect(
      getOpeningHoursStatus(
        openingHours,
        new Date("2026-01-05T19:30:00.000Z"),
      ),
    ).toBe("closed");
  });

  it("applies seasonal hours and then date exceptions over the weekly schedule", () => {
    const overridden: OpeningHours = {
      ...openingHours,
      seasons: [
        {
          id: "winter",
          label: "Winter",
          startDate: "2026-01-01",
          endDate: "2026-02-28",
          days: [
            {
              day: "monday",
              intervals: [{ opensAt: "10:00", closesAt: "11:00" }],
            },
          ],
        },
      ],
      exceptions: [
        {
          id: "holiday",
          label: "Holiday",
          startDate: "2026-01-05",
          endDate: "2026-01-05",
          intervals: [],
        },
      ],
    };

    validateOpeningHours(overridden);
    expect(
      getOpeningHoursStatus(
        overridden,
        new Date("2026-01-05T14:30:00.000Z"),
      ),
    ).toBe("closed");
  });

  it("returns unknown when the timezone, instant, or weekday schedule is missing", () => {
    expect(
      getOpeningHoursStatus(
        { ...openingHours, timeZone: undefined },
        new Date("2026-01-05T14:30:00.000Z"),
      ),
    ).toBe("unknown");
    expect(getOpeningHoursStatus(openingHours)).toBe("unknown");
    expect(
      getOpeningHoursStatus(
        openingHours,
        new Date("2026-01-04T15:00:00.000Z"),
      ),
    ).toBe("unknown");
  });

  it("reports explicitly closed days and formats weekday labels", () => {
    expect(
      getOpeningHoursStatus(
        openingHours,
        new Date("2026-01-06T15:00:00.000Z"),
      ),
    ).toBe("closed");
    expect(formatOpeningHoursWeekday("monday", "en-US")).toBe("Monday");
  });

  it("handles daylight-saving offsets by formatting the supplied instant in the venue zone", () => {
    expect(
      getOpeningHoursStatus(
        openingHours,
        new Date("2026-03-09T15:30:00.000Z"),
      ),
    ).toBe("open");
  });

  it("rejects malformed dates, time ranges, overlap, and timezones", () => {
    expect(() =>
      validateOpeningHours({
        days: [
          {
            day: "monday",
            intervals: [{ opensAt: "25:00", closesAt: "26:00" }],
          },
        ],
      }),
    ).toThrow(RangeError);
    expect(() =>
      validateOpeningHours({
        days: [
          {
            day: "monday",
            intervals: [
              { opensAt: "09:00", closesAt: "12:00" },
              { opensAt: "11:00", closesAt: "13:00" },
            ],
          },
        ],
      }),
    ).toThrow(RangeError);
    expect(() =>
      validateOpeningHours({
        days: [],
        exceptions: [
          {
            id: "malformed-date",
            label: "Malformed",
            startDate: "2026/02/28",
            endDate: "2026/02/28",
            intervals: [],
          },
        ],
      }),
    ).toThrow(RangeError);
    expect(() =>
      validateOpeningHours({
        days: [],
        exceptions: [
          {
            id: "invalid-date",
            label: "Invalid",
            startDate: "2026-02-30",
            endDate: "2026-02-30",
            intervals: [],
          },
        ],
      }),
    ).toThrow(RangeError);
    expect(() =>
      validateOpeningHours({ days: [], timeZone: "Mars/West" }),
    ).toThrow(RangeError);
  });

  it("allows 24:00 only as a closing time and rejects reversed date ranges", () => {
    expect(() =>
      validateOpeningHours({
        days: [
          {
            day: "monday",
            intervals: [{ opensAt: "18:00", closesAt: "24:00" }],
          },
        ],
      }),
    ).not.toThrow();

    expect(() =>
      validateOpeningHours({
        days: [
          {
            day: "monday",
            intervals: [{ opensAt: "24:00", closesAt: "24:00" }],
          },
        ],
      }),
    ).toThrow(RangeError);

    expect(() =>
      validateOpeningHours({
        days: [],
        exceptions: [
          {
            id: "reversed",
            label: "Reversed",
            startDate: "2026-02-28",
            endDate: "2026-02-27",
            intervals: [],
          },
        ],
      }),
    ).toThrow(RangeError);
  });

  it("rejects duplicate weekdays and overlapping exception ranges", () => {
    expect(() =>
      validateOpeningHours({
        days: [
          { day: "monday", intervals: [] },
          { day: "monday", intervals: [] },
        ],
      }),
    ).toThrow(TypeError);

    expect(() =>
      validateOpeningHours({
        days: [],
        exceptions: [
          {
            id: "first",
            label: "First",
            startDate: "2026-12-24",
            endDate: "2026-12-26",
            intervals: [],
          },
          {
            id: "second",
            label: "Second",
            startDate: "2026-12-26",
            endDate: "2026-12-27",
            intervals: [],
          },
        ],
      }),
    ).toThrow(RangeError);
  });

  it("rejects an invalid status instant and formats dates and times without implicit timezone conversion", () => {
    expect(() =>
      getOpeningHoursStatus(openingHours, new Date(Number.NaN)),
    ).toThrow(RangeError);
    expect(formatOpeningHoursTime("13:30", "en-US")).toBe("1:30 PM");
    expect(formatOpeningHoursTime("24:00", "en-GB")).toBe("24:00");
    expect(formatOpeningHoursDate("2026-06-15", "en-US")).toBe("Jun 15, 2026");
  });
});
