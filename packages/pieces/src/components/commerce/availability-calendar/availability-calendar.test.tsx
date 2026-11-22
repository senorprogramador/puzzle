import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AvailabilityCalendar } from "./index";

afterEach(cleanup);

describe("AvailabilityCalendar", () => {
  it("renders supplied availability statuses and a legend", () => {
    render(
      <AvailabilityCalendar
        title="Choose your stay"
        locale="en-GB"
        availability={[
          { date: new Date(2025, 2, 15), status: "available", price: { amount: 120, currency: "EUR" } },
          { date: new Date(2025, 2, 16), status: "blocked" },
        ]}
      />,
    );

    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Blocked")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose check-in and check-out" })).toBeInTheDocument();
  });

  it("renders the empty state and disables selection without data", () => {
    render(<AvailabilityCalendar availability={[]} emptyState="No dates loaded." />);
    expect(screen.getByText("No dates loaded.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose check-in and check-out" })).toBeDisabled();
  });
});
