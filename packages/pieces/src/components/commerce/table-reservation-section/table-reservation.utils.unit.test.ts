import { describe, expect, it } from "vitest";
import {
  DEFAULT_TABLE_RESERVATION_VALUES,
  calendarDateToPickerDate,
  hasTableReservationErrors,
  isValidCalendarDate,
  mergeTableReservationErrors,
  normalizeTableReservationValue,
  pickerDateToCalendarDate,
  validateTableReservation,
} from "./table-reservation.utils";
import type { TableReservationValues } from "./table-reservation-section.types";

const validReservation: TableReservationValues = {
  ...DEFAULT_TABLE_RESERVATION_VALUES,
  date: "2026-06-15",
  time: "19:00",
  partySize: 4,
  seating: "indoor",
  guestName: "Alex Morgan",
  email: "alex@example.com",
};

describe("table reservation utilities", () => {
  it("normalizes partial defaults without mutating the shared default value", () => {
    expect(normalizeTableReservationValue({ partySize: 3 })).toEqual({
      ...DEFAULT_TABLE_RESERVATION_VALUES,
      partySize: 3,
    });
    expect(DEFAULT_TABLE_RESERVATION_VALUES.partySize).toBe(2);
  });

  it("accepts valid calendar dates and rejects malformed or impossible dates", () => {
    expect(isValidCalendarDate("2024-02-29")).toBe(true);
    expect(isValidCalendarDate("2026-02-30")).toBe(false);
    expect(isValidCalendarDate("0000-01-01")).toBe(false);
    expect(isValidCalendarDate("06/15/2026")).toBe(false);
    expect(isValidCalendarDate(null)).toBe(false);
  });

  it("converts calendar dates using local calendar fields and handles invalid values", () => {
    const pickerDate = calendarDateToPickerDate("2026-06-15");
    expect(pickerDate).toBeInstanceOf(Date);
    expect(pickerDate?.getFullYear()).toBe(2026);
    expect(pickerDate?.getMonth()).toBe(5);
    expect(pickerDate?.getDate()).toBe(15);
    expect(calendarDateToPickerDate("2026-02-30")).toBeNull();

    expect(pickerDateToCalendarDate(pickerDate)).toBe("2026-06-15");
    expect(pickerDateToCalendarDate(null)).toBeNull();
    expect(pickerDateToCalendarDate(new Date(Number.NaN))).toBeNull();
  });

  it("validates the caller's reservation values without applying business availability rules", () => {
    expect(validateTableReservation(validReservation, 1, 8)).toEqual({});

    const invalidSeating = { ...validReservation };
    Reflect.set(invalidSeating, "seating", "balcony");
    expect(validateTableReservation(invalidSeating, 1, 8)).toHaveProperty(
      "seating",
    );

    expect(
      validateTableReservation(
        {
          ...validReservation,
          date: "2026-02-30",
          time: "25:00",
          partySize: 1.5,
          guestName: " ",
          email: "invalid",
        },
        2,
        8,
      ),
    ).toEqual(
      expect.objectContaining({
        date: expect.any(String),
        time: expect.any(String),
        partySize: expect.any(String),
        guestName: expect.any(String),
        email: expect.any(String),
      }      ),
    );
    expect(
      validateTableReservation(
        { ...validReservation, partySize: 9 },
        1,
        8,
      ),
    ).toHaveProperty("partySize");
    expect(
      validateTableReservation(
        { ...validReservation, partySize: 0 },
        1,
        8,
      ),
    ).toHaveProperty("partySize");
  });

  it("merges externally supplied errors and detects only meaningful messages", () => {
    expect(
      mergeTableReservationErrors(
        { date: "Choose a date." },
        { date: "The provider does not accept this date." },
      ),
    ).toEqual({ date: "The provider does not accept this date." });

    expect(
      hasTableReservationErrors({
        date: undefined,
        time: null,
        partySize: false,
        seating: "",
      }),
    ).toBe(false);
    expect(hasTableReservationErrors({ email: "Invalid email." })).toBe(true);
  });
});
