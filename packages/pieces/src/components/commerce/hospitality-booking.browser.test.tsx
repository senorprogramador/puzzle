import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { AvailabilitySearchSection } from "./availability-search-section";
import { RatePlansSection } from "./rate-plans-section";
import { StaySummarySection } from "./stay-summary-section";
import { HouseRulesSection } from "../business/house-rules-section";
import type { AvailabilitySearchValues } from "./availability-search-section";

afterEach(cleanup);

const viewports = [
  [320, 568],
  [375, 812],
  [430, 932],
  [540, 900],
  [768, 1024],
  [900, 900],
  [1024, 1366],
  [1280, 800],
  [1366, 900],
  [1440, 900],
  [1920, 1080],
] as const;

const value: AvailabilitySearchValues = {
  checkIn: new Date(2026, 8, 10),
  checkOut: new Date(2026, 8, 14),
  guests: { adults: 2, children: 1, childAges: [5] },
  accommodationId: null,
  flexibleDates: true,
};

const rates = [
  {
    id: "flexible",
    name: "Flexible rate with a very long cancellation condition",
    description: "A generous option for guests planning ahead. ".repeat(3),
    pricePerNight: { amount: 125, currency: "EUR" },
    weeklyPrice: { amount: 750, currency: "EUR" },
    includedServices: [
      { id: "breakfast", label: "Breakfast included" },
      { id: "parking", label: "Private parking" },
    ],
    cancellation: "Free cancellation until two days before check-in.",
    featured: true,
    action: <a href="/external-booking">Book with the host</a>,
  },
  {
    id: "advance",
    name: "Advance purchase",
    pricePerNight: { amount: 98, currency: "USD" },
    onSelect: () => undefined,
  },
  {
    id: "family",
    name: "Family package",
    pricePerNight: { amount: 240, currency: "GBP" },
    onSelect: () => undefined,
  },
];

const priceLines = Array.from({ length: 12 }, (_, index) => ({
  id: `price-${index}`,
  label: `Long externally supplied price item ${index} `.repeat(3),
  amount: { amount: index * 75, currency: "EUR" },
  kind: (index === 2 ? "discount" : "fee") as "discount" | "fee",
}));

const categories = [
  {
    id: "arrival",
    title: "Arrival and departure",
    rules: [
      {
        id: "check-in",
        label: "Check-in",
        value: "From 3:00 PM",
        description: "Share your estimated arrival time with the host.",
      },
    ],
  },
  {
    id: "practical",
    title: "Practical arrangements",
    rules: [
      {
        id: "parking",
        label: "Parking",
        value: "One private space",
      },
      {
        id: "payment",
        label: "Payment",
        value: "Payment information is provided by the host.",
      },
    ],
  },
];

describe("hospitality booking responsive behavior", () => {
  it("keeps all four sections within the requested viewport matrix", async () => {
    const { container } = render(
      <>
        <AvailabilitySearchSection
          title="Search a stay"
          value={value}
          locale="en-US"
          childAgeOptions={[{ value: 5, label: "5 years" }]}
          onSubmit={() => undefined}
        />
        <RatePlansSection title="Rate plans" plans={rates} locale="en-US" />
        <StaySummarySection
          title="Your stay"
          accommodation={{
            name: "A very long accommodation name ".repeat(3),
            image: {
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'/%3E",
              alt: "The accommodation",
            },
          }}
          checkIn={value.checkIn}
          checkOut={value.checkOut}
          guests={value.guests}
          nights={4}
          priceLines={priceLines}
          total={{ amount: 34567.89, currency: "EUR" }}
          locale="en-US"
          variant="compact"
        />
        <HouseRulesSection
          title="House rules"
          categories={categories}
          variant="expanded"
        />
      </>,
    );
    const sectionSelectors = [
      ".puzzle-availability-search",
      ".puzzle-rate-plans",
      ".puzzle-stay-summary",
      ".puzzle-house-rules",
    ];

    for (const [width, height] of viewports) {
      await page.viewport(width, height);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      for (const selector of sectionSelectors) {
        const section = container.querySelector<HTMLElement>(selector)!;
        expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
      }
    }

    await page.viewport(375, 812);
    expect(
      getComputedStyle(
        container.querySelector(".puzzle-rate-plans__grid")!,
      ).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);
    expect(
      getComputedStyle(
        container.querySelector(".puzzle-stay-summary__layout")!,
      ).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);

    await page.viewport(1024, 1366);
    expect(
      getComputedStyle(
        container.querySelector(".puzzle-rate-plans__grid")!,
      ).gridTemplateColumns.trim().split(/\s+/).length,
    ).toBeGreaterThan(1);
    expect(
      getComputedStyle(
        container.querySelector(".puzzle-stay-summary__layout")!,
      ).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(2);
  });

  it("opens the date popover from the keyboard and keeps its dialog accessible", async () => {
    const user = userEvent.setup();
    render(
      <AvailabilitySearchSection
        value={value}
        locale="en-US"
        onSubmit={() => undefined}
      />,
    );

    const checkIn = screen.getByRole("button", { name: "Check-in" });
    checkIn.focus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("dialog", {
      name: "Choose check-in date",
    });
    expect(dialog).toBeInTheDocument();
    expect(checkIn).toHaveAttribute("aria-expanded", "true");
  });
});
