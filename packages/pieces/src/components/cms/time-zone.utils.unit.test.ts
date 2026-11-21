import { describe, expect, it } from "vitest";
import { toDateTimeInputValue, toInstantInTimeZone } from "./time-zone.utils";

describe("CMS authoring time-zone helpers", () => {
  it("round trips local date and time values in an explicit timezone", () => {
    const instant = toInstantInTimeZone(
      "2026-07-14T09:30",
      "Europe/Amsterdam",
    );

    expect(instant.toISOString()).toBe("2026-07-14T07:30:00.000Z");
    expect(toDateTimeInputValue(instant, "Europe/Amsterdam")).toBe(
      "2026-07-14T09:30",
    );
  });

  it("rejects local times skipped by a daylight-saving transition", () => {
    expect(() =>
      toInstantInTimeZone("2026-03-08T02:30", "America/New_York"),
    ).toThrow(/does not exist/);
  });

  it("chooses the earlier instant for an ambiguous daylight-saving time", () => {
    expect(
      toInstantInTimeZone("2026-11-01T01:30", "America/New_York").toISOString(),
    ).toBe("2026-11-01T05:30:00.000Z");
  });

  it("surfaces invalid date, time, and timezone values", () => {
    expect(() => toInstantInTimeZone("2026-02-30T12:00", "UTC")).toThrow(
      /valid local date and time/,
    );
    expect(() => toInstantInTimeZone("2026-01-01T12:00", "Not/AZone")).toThrow();
  });
});
