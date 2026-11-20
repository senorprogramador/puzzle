import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RatePlansSection } from "./rate-plans-section";
import type { RatePlan } from "./rate-plans-section.types";

afterEach(cleanup);

const plans: RatePlan[] = [
  {
    id: "flexible",
    name: "Flexible stay",
    description: "Cancel up to two days before arrival.",
    arrangement: "Bed and breakfast",
    pricePerNight: { amount: 125, currency: "EUR" },
    weeklyPrice: { amount: 750, currency: "EUR" },
    includedServices: [
      { id: "breakfast", label: "Breakfast" },
      { id: "parking", label: "On-site parking", description: "One space." },
    ],
    cancellation: "Free cancellation until two days before check-in.",
    featured: true,
    action: <a href="/external-booking">Book with the host</a>,
  },
  {
    id: "non-refundable",
    name: "Advance purchase",
    pricePerNight: { amount: 98, currency: "USD" },
    onSelect: vi.fn(),
    actionLabel: "Select advance rate",
  },
];

describe("RatePlansSection", () => {
  it("renders per-night and supplied weekly prices without calculating totals", () => {
    render(
      <RatePlansSection
        title="Choose a rate"
        plans={plans}
        locale="nl-NL"
      />,
    );

    expect(screen.getByRole("heading", { name: "Choose a rate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Flexible stay" })).toBeInTheDocument();
    expect(screen.getByText(/125,00/)).toBeInTheDocument();
    expect(screen.getByText(/750,00/)).toBeInTheDocument();
    expect(screen.getByText(/98,00/)).toBeInTheDocument();
    expect(screen.getByText("Free cancellation until two days before check-in.")).toBeInTheDocument();
    expect(screen.getByText("Breakfast")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book with the host" })).toHaveAttribute(
      "href",
      "/external-booking",
    );
    expect(
      screen.getByRole("button", { name: "Select advance rate" }),
    ).toBeInTheDocument();
  });

  it("calls the selected rate callback and respects its disabled state", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { rerender } = render(
      <RatePlansSection
        plans={[
          {
            id: "room-only",
            name: "Room only",
            pricePerNight: { amount: 0, currency: "JPY" },
            onSelect,
          },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Choose this rate" }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    rerender(
      <RatePlansSection
        plans={[
          {
            id: "room-only",
            name: "Room only",
            pricePerNight: { amount: 0, currency: "JPY" },
            onSelect,
            disabled: true,
          },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Choose this rate" })).toBeDisabled();
  });

  it("renders a useful empty state and server markup", () => {
    render(<RatePlansSection plans={[]} emptyState="No rates yet." />);
    expect(screen.getByRole("status")).toHaveTextContent("No rates yet.");

    const markup = renderToStaticMarkup(
      <RatePlansSection plans={plans} locale="en-GB" />,
    );
    expect(markup).toContain("Flexible stay");
    expect(markup).toContain("Recommended");
  });

  it("rejects duplicate plan IDs and service IDs", () => {
    expect(() =>
      render(
        <RatePlansSection
          plans={[
            plans[0]!,
            { ...plans[1]!, id: "flexible" },
          ]}
        />,
      ),
    ).toThrow("Rate plans IDs must be non-empty and unique.");

    expect(() =>
      render(
        <RatePlansSection
          plans={[
            {
              id: "duplicate-services",
              name: "Rate",
              pricePerNight: { amount: 100, currency: "EUR" },
              includedServices: [
                { id: "wifi", label: "Wi-Fi" },
                { id: "wifi", label: "Wi-Fi" },
              ],
              onSelect: vi.fn(),
            },
          ]}
        />,
      ),
    ).toThrow(
      'Services for rate plan "duplicate-services" IDs must be non-empty and unique.',
    );
  });
});
