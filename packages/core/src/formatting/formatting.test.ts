import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatDateRange,
  formatNumber,
  formatTime,
} from "../index";
import type { DateRange } from "../index";

describe("international formatting", () => {
  it("formats currency and numbers using the supplied locale", () => {
    expect(formatCurrency(1234.5, "EUR", "nl-NL")).toBe(
      new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(1234.5),
    );
    expect(formatCurrency(1234, "JPY", "ja-JP")).toBe(
      new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
      }).format(1234),
    );
    expect(formatNumber(1234.5, "de-DE")).toBe(
      new Intl.NumberFormat("de-DE").format(1234.5),
    );
  });

  it("rejects invalid numbers, currencies, and locales", () => {
    expect(() => formatCurrency(Number.NaN, "USD", "en-US")).toThrow(
      "Currency amount must be a finite number.",
    );
    expect(() => formatCurrency(1, "", "en-US")).toThrow(
      "Currency must be a non-empty ISO 4217 code.",
    );
    expect(() => formatCurrency(1, "not-a-code", "en-US")).toThrow(RangeError);
    expect(() => formatCurrency(1, "USD", "not_a_locale")).toThrow(RangeError);
    expect(() => formatNumber(Number.POSITIVE_INFINITY, "en-US")).toThrow(
      "Number value must be a finite number.",
    );
    expect(() => formatNumber(1, "not_a_locale")).toThrow(RangeError);
  });

  it("formats dates and times with caller-supplied locale and timezone", () => {
    const date = new Date("2025-03-04T15:06:00.000Z");
    const dateOptions: Intl.DateTimeFormatOptions = {
      dateStyle: "medium",
      timeZone: "UTC",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    };

    expect(formatDate(date, "en-GB", dateOptions)).toBe(
      new Intl.DateTimeFormat("en-GB", dateOptions).format(date),
    );
    expect(formatTime(date, "en-US", timeOptions)).toBe(
      new Intl.DateTimeFormat("en-US", timeOptions).format(date),
    );
    expect(() => formatDate(new Date(Number.NaN), "en-US")).toThrow(
      "Date must be a valid Date.",
    );
  });

  it("formats ordered date ranges and rejects invalid ranges", () => {
    const range: DateRange = {
      start: new Date("2025-03-04T00:00:00.000Z"),
      end: new Date("2025-03-08T00:00:00.000Z"),
    };
    const options: Intl.DateTimeFormatOptions = {
      dateStyle: "medium",
      timeZone: "UTC",
    };

    expect(formatDateRange(range, "en-US", options)).toBe(
      new Intl.DateTimeFormat("en-US", options).formatRange(
        range.start,
        range.end,
      ),
    );
    expect(
      formatDateRange(
        { start: range.start, end: range.start },
        "en-US",
        options,
      ),
    ).toBe(formatDate(range.start, "en-US", options));
    expect(() =>
      formatDateRange(
        { start: range.end, end: range.start },
        "en-US",
        options,
      ),
    ).toThrow("Date range start must not be after its end.");
    expect(() =>
      formatDateRange(
        { start: new Date(Number.NaN), end: range.end },
        "en-US",
      ),
    ).toThrow("Date range start must be a valid Date.");
  });
});
