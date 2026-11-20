import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import type { OpeningHours } from "./opening-hours-section.types";
import { OpeningHoursSection } from "./opening-hours-section";

afterEach(cleanup);

const openingHours: OpeningHours = {
  timeZone: "Europe/Amsterdam",
  days: [
    {
      day: "monday",
      intervals: [
        {
          opensAt: "11:30",
          closesAt: "14:30",
          label: "Lunch service with a long descriptive label",
        },
        { opensAt: "17:00", closesAt: "23:00", label: "Dinner" },
      ],
    },
    { day: "tuesday", intervals: [] },
    {
      day: "wednesday",
      intervals: [{ opensAt: "12:00", closesAt: "22:00" }],
    },
    {
      day: "thursday",
      intervals: [{ opensAt: "12:00", closesAt: "22:00" }],
    },
    {
      day: "friday",
      intervals: [{ opensAt: "12:00", closesAt: "23:00" }],
    },
    {
      day: "saturday",
      intervals: [{ opensAt: "12:00", closesAt: "23:00" }],
    },
    {
      day: "sunday",
      intervals: [{ opensAt: "12:00", closesAt: "21:00" }],
    },
  ],
};

describe("OpeningHoursSection browser behavior", () => {
  it("keeps the weekly list fluid at mobile, intermediate, and desktop widths", async () => {
    const { container } = render(
      <OpeningHoursSection
        title="Hours for a restaurant with a deliberately long title"
        openingHours={openingHours}
        showStatus
        statusAt={new Date("2026-06-15T10:00:00.000Z")}
        locale="en-GB"
      />,
    );
    const section = container.querySelector<HTMLElement>(
      ".puzzle-opening-hours-section",
    )!;
    const week = section.querySelector<HTMLElement>(
      ".puzzle-opening-hours-section__week",
    )!;

    for (const [width, height] of [
      [320, 568],
      [375, 812],
      [430, 932],
      [540, 900],
      [768, 1024],
      [900, 900],
      [1024, 1366],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
    ] as const) {
      await page.viewport(width, height);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
      expect(week.scrollWidth).toBeLessThanOrEqual(week.clientWidth);
    }

    await page.viewport(375, 812);
    expect(
      getComputedStyle(week).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);

    await page.viewport(1440, 900);
    expect(
      getComputedStyle(week).gridTemplateColumns.trim().split(/\s+/).length,
    ).toBeGreaterThan(1);
  });
});
