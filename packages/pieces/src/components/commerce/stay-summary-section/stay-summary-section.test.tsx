import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StaySummarySection } from "./stay-summary-section";
import type { StaySummaryPriceLine } from "./stay-summary-section.types";

afterEach(cleanup);

const priceLines: StaySummaryPriceLine[] = [
  {
    id: "stay",
    label: "Four-night stay",
    amount: { amount: 1450, currency: "EUR" },
    kind: "rate",
  },
  {
    id: "discount",
    label: "Spring offer",
    amount: { amount: -125, currency: "EUR" },
    kind: "discount",
  },
  {
    id: "cleaning",
    label: "Cleaning fee",
    amount: { amount: 89.95, currency: "EUR" },
    kind: "fee",
  },
  {
    id: "breakfast",
    label: "Breakfast",
    amount: { amount: 120, currency: "EUR" },
    kind: "service",
  },
];

const summaryProps = {
  accommodation: {
    name: "A spacious family home beside the river",
    description: "Caller-provided accommodation details.",
    image: {
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'/%3E",
      alt: "The family home",
    },
  },
  checkIn: new Date("2026-03-09T01:00:00.000Z"),
  checkOut: new Date("2026-03-13T01:00:00.000Z"),
  guests: { adults: 2, children: 1, childAges: [5] },
  nights: 4,
  subtotal: { amount: 1450, currency: "EUR" },
  priceLines,
  total: { amount: 1534.95, currency: "EUR" },
};

describe("StaySummarySection", () => {
  it("presents caller-provided stay details and price lines", () => {
    render(
      <StaySummarySection
        {...summaryProps}
        locale="en-US"
        timeZone="America/Los_Angeles"
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "A spacious family home beside the river",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Mar 8, 2026")).toBeInTheDocument();
    expect(screen.getByText("Four-night stay")).toBeInTheDocument();
    expect(screen.getByText("Spring offer")).toBeInTheDocument();
    expect(screen.getByText("Cleaning fee")).toBeInTheDocument();
    expect(screen.getByText("Breakfast")).toBeInTheDocument();
    expect(screen.getByText("€1,534.95")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("supports edit and continue callbacks", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onContinue = vi.fn();
    render(
      <StaySummarySection
        {...summaryProps}
        onEdit={onEdit}
        onContinue={onContinue}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Change stay" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("renders sparse data without optional media, price rows, or actions", () => {
    const sparseProps = {
      accommodation: { name: "A simple stay" },
      checkIn: null,
      checkOut: null,
      guests: { adults: 1, children: 0 },
      total: { amount: 0, currency: "EUR" },
    };
    const { rerender } = render(
      <StaySummarySection
        {...sparseProps}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "A simple stay" })).toBeInTheDocument();
    expect(screen.queryByText("Change stay")).toBeInTheDocument();
    expect(screen.queryByText("Continue")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Accommodation image image unavailable" }),
    ).toBeInTheDocument();

    rerender(<StaySummarySection {...sparseProps} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText("Subtotal")).not.toBeInTheDocument();
    expect(screen.queryByText("Nights")).not.toBeInTheDocument();
    expect(screen.getAllByText("Not selected")).toHaveLength(2);
  });

  it("supports missing dates, long price lists, and server rendering", () => {
    const manyLines = Array.from({ length: 32 }, (_, index) => ({
      id: `line-${index}`,
      label: `Caller-provided charge ${index}`,
      amount: { amount: index * 1000, currency: "JPY" },
      kind: "service" as const,
    }));

    render(
      <StaySummarySection
        {...summaryProps}
        checkIn={null}
        checkOut={null}
        priceLines={manyLines}
        total={{ amount: Number.MAX_SAFE_INTEGER, currency: "JPY" }}
        variant="compact"
      />,
    );
    expect(screen.getAllByText("Not selected")).toHaveLength(2);
    expect(screen.getByText("Caller-provided charge 31")).toBeInTheDocument();

    const markup = renderToStaticMarkup(
      <StaySummarySection {...summaryProps} locale="en-US" />,
    );
    expect(markup).toContain("Price summary");
    expect(markup).toContain("Spring offer");
  });

  it("rejects invalid counts, nights, and repeated price-line IDs", () => {
    expect(() =>
      render(
        <StaySummarySection
          {...summaryProps}
          guests={{ adults: -1, children: 0 }}
        />,
      ),
    ).toThrow("Stay summary guest counts must be non-negative safe integers.");

    expect(() =>
      render(<StaySummarySection {...summaryProps} nights={1.5} />),
    ).toThrow("Stay summary nights must be a non-negative integer.");

    expect(() =>
      render(
        <StaySummarySection
          {...summaryProps}
          priceLines={[priceLines[0]!, priceLines[0]!]}
        />,
      ),
    ).toThrow("Stay summary price lines IDs must be non-empty and unique.");
  });
});
