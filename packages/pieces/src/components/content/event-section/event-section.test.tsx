import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { EventSection } from "./event-section";

const events = [
  {
    id: "saas-summit",
    title: "Northstar SaaS Summit",
    startDate: "2026-11-17T12:00:00Z",
    endDate: "2026-11-17T15:00:00Z",
    dateLabel: "November 17, 2026",
    category: "Conference",
    location: "Amsterdam",
    price: "€120",
    href: "/events/saas-summit",
    featured: true,
  },
  {
    id: "studio-workshop",
    title: "Agency growth workshop",
    startDate: "2026-11-16T09:00:00Z",
    endDate: "2026-11-16T12:00:00Z",
    dateLabel: "November 16, 2026",
    category: "Workshop",
    location: "Online",
  },
  {
    id: "design-lab",
    title: "Product design lab",
    startDate: "2026-12-04T10:00:00Z",
    dateLabel: "December 4, 2026",
    category: "Workshop",
  },
];

describe("EventSection", () => {
  it("classifies date boundaries and filters past events deterministically", () => {
    render(
      <EventSection
        title="Events"
        variant="calendar"
        events={events}
        referenceDate="2026-11-17T12:00:00Z"
      />,
    );

    expect(screen.getByText("Northstar SaaS Summit").closest("article")).toHaveTextContent(
      "Upcoming",
    );
    expect(screen.getByText("Agency growth workshop").closest("article")).toHaveTextContent(
      "Past",
    );

    fireEvent.click(screen.getByRole("button", { name: "Past" }));
    expect(screen.queryByText("Northstar SaaS Summit")).toBeNull();
    expect(screen.getByText("Agency growth workshop")).toBeVisible();
  });

  it("supports category filtering, event links, and empty results", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <EventSection
        title="Upcoming events"
        variant="upcoming"
        events={events}
        referenceDate="2026-11-17T00:00:00Z"
      />,
    );

    expect(screen.getByRole("link", { name: "Northstar SaaS Summit" })).toHaveAttribute(
      "href",
      "/events/saas-summit",
    );
    screen.getByRole("combobox", { name: "Category" }).focus();
    await user.keyboard("c");
    await user.keyboard("{Enter}");
    expect(screen.getByText("Northstar SaaS Summit")).toBeVisible();
    expect(screen.queryByText("Product design lab")).toBeNull();

    rerender(
      <EventSection
        title="No events"
        events={[]}
        referenceDate="2026-11-17T00:00:00Z"
      />,
    );
    expect(screen.getByRole("heading", { name: "No events found" })).toBeVisible();
  });

  it("rejects malformed or reversed date ranges", () => {
    expect(() =>
      render(
        <EventSection
          title="Invalid event"
          events={[{ id: "bad", title: "Bad date", startDate: "not-a-date" }]}
          referenceDate="2026-11-17T00:00:00Z"
        />,
      ),
    ).toThrow('Event "bad" has an invalid start date.');

    expect(() =>
      render(
        <EventSection
          title="Reversed event"
          events={[
            {
              id: "reversed",
              title: "Reversed dates",
              startDate: "2026-11-18T00:00:00Z",
              endDate: "2026-11-17T00:00:00Z",
            },
          ]}
          referenceDate="2026-11-17T00:00:00Z"
        />,
      ),
    ).toThrow('Event "reversed" ends before it starts.');
  });
});
