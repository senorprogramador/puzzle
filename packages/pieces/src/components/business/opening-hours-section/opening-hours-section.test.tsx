import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { OpeningHoursSection } from "./opening-hours-section";
import type { OpeningHours } from "./opening-hours-section.types";

afterEach(cleanup);

const schedule: OpeningHours = {
  timeZone: "America/New_York",
  days: [
    {
      day: "monday",
      intervals: [
        { opensAt: "11:00", closesAt: "14:00", label: "Lunch" },
        { opensAt: "17:00", closesAt: "22:00", label: "Dinner" },
      ],
    },
    { day: "tuesday", intervals: [] },
  ],
  exceptions: [
    {
      id: "holiday",
      label: "Public holiday",
      startDate: "2026-12-24",
      endDate: "2026-12-25",
      intervals: [{ opensAt: "10:00", closesAt: "12:00", label: "Special hours" }],
    },
  ],
  seasons: [
    {
      id: "summer",
      label: "Summer service",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      days: [
        {
          day: "monday",
          intervals: [{ opensAt: "12:00", closesAt: "21:00" }],
        },
      ],
    },
  ],
};

describe("OpeningHoursSection", () => {
  it("renders a seven-day overview, multiple periods, closed days, and missing days distinctly", () => {
    const { container } = render(
      <OpeningHoursSection
        title="Opening hours"
        openingHours={schedule}
        locale="en-US"
      />,
    );

    const weeklySchedule = container.querySelector<HTMLElement>(
      ".puzzle-opening-hours-section__week",
    )!;
    expect(within(weeklySchedule).getByText("Monday")).toBeInTheDocument();
    expect(
      within(weeklySchedule).getByText("11:00 AM – 2:00 PM"),
    ).toBeInTheDocument();
    expect(
      within(weeklySchedule).getByText("5:00 PM – 10:00 PM"),
    ).toBeInTheDocument();
    expect(within(weeklySchedule).getByText("Closed")).toBeInTheDocument();
    expect(within(weeklySchedule).getAllByText("Hours not provided")).toHaveLength(5);
  });

  it("shows exception and seasonal schedules in both layout variants", () => {
    const { container } = render(
      <OpeningHoursSection
        openingHours={schedule}
        variant="compact"
        locale="en-US"
      />,
    );

    expect(container.querySelector('[data-variant="compact"]')).toBeInTheDocument();
    expect(screen.getByText("Public holiday")).toBeInTheDocument();
    expect(screen.getByText("Special hours")).toBeInTheDocument();
    expect(screen.getByText("Dec 24, 2026 – Dec 25, 2026")).toBeInTheDocument();
    expect(screen.getByText("Summer service")).toBeInTheDocument();
    expect(screen.getByText("Exceptions")).toBeInTheDocument();
    expect(screen.getByText("Seasonal hours")).toBeInTheDocument();
  });

  it("omits empty period groups and shows a supplied closed status", () => {
    render(
      <OpeningHoursSection
        openingHours={{
          timeZone: "UTC",
          days: [{ day: "tuesday", intervals: [] }],
        }}
        showStatus
        statusAt={new Date("2026-01-06T15:00:00.000Z")}
        children="Additional opening-hours information."
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Closed");
    expect(screen.queryByText("Exceptions")).not.toBeInTheDocument();
    expect(screen.queryByText("Seasonal hours")).not.toBeInTheDocument();
    expect(screen.getByText("Additional opening-hours information.")).toBeInTheDocument();
  });

  it("shows an explicit unknown status when the instant or timezone is unavailable", () => {
    render(
      <OpeningHoursSection
        openingHours={{ ...schedule, timeZone: undefined }}
        showStatus
        statusAt={new Date("2026-06-15T16:30:00.000Z")}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Status unknown");
  });

  it("uses the timezone and supplied instant for its current status", () => {
    render(
      <OpeningHoursSection
        openingHours={schedule}
        showStatus
        statusAt={new Date("2026-01-05T16:30:00.000Z")}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Open");
    expect(screen.getByText("Venue time zone:")).toBeInTheDocument();
    expect(screen.getByText("America/New_York")).toBeInTheDocument();
  });

  it("fails explicitly for invalid schedule values and status dates", () => {
    expect(() =>
      render(
        <OpeningHoursSection
          openingHours={{
            days: [
              {
                day: "monday",
                intervals: [{ opensAt: "19:00", closesAt: "18:00" }],
              },
            ],
          }}
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <OpeningHoursSection
          openingHours={schedule}
          showStatus
          statusAt={new Date(Number.NaN)}
        />,
      ),
    ).toThrow(RangeError);
  });

  it("renders on the server with deterministic status props", () => {
    const markup = renderToStaticMarkup(
      <OpeningHoursSection
        openingHours={schedule}
        showStatus
        statusAt={new Date("2026-01-05T16:30:00.000Z")}
        locale="en-US"
      />,
    );

    expect(markup).toContain("Current status");
    expect(markup).toContain("Open");
    expect(markup).toContain("America/New_York");
  });
});
