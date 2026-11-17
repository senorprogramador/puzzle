import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PricingSection } from "./pricing";
import type { PricingPlan } from "./pricing.types";

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For focused teams.",
    prices: [
      {
        intervalId: "monthly",
        amount: 24,
        currency: "$",
        interval: "per month",
      },
      {
        intervalId: "yearly",
        amount: 240,
        currency: "$",
        interval: "per year",
        originalAmount: 288,
        discount: "Save 17%",
      },
    ],
    features: [
      { id: "projects", label: "Projects", value: "10" },
      { id: "support", label: "Email support", included: true },
    ],
    cta: <a href="/start">Choose Starter</a>,
  },
  {
    id: "scale",
    name: "Scale",
    customPricing: <a href="/sales">Talk to sales</a>,
    usage: "Usage is billed from reported monthly events.",
    features: [
      { id: "projects", label: "Projects", value: "Unlimited" },
      { id: "priority", label: "Priority support", included: true },
    ],
    highlighted: true,
  },
];

afterEach(cleanup);

describe("PricingSection", () => {
  it("switches between explicitly supplied prices without calculating discounts", async () => {
    const user = userEvent.setup();
    const onBillingIntervalChange = vi.fn();
    render(
      <PricingSection
        variant="toggle"
        plans={plans}
        billingIntervals={[
          { id: "monthly", label: "Monthly" },
          { id: "yearly", label: "Yearly" },
        ]}
        defaultBillingInterval="monthly"
        onBillingIntervalChange={onBillingIntervalChange}
      />,
    );

    expect(screen.getByText("24")).toBeVisible();
    await user.click(screen.getByRole("radio", { name: "Yearly" }));

    expect(screen.getByText("240")).toBeVisible();
    expect(screen.getByText("$288")).toBeVisible();
    expect(screen.getByText("Save 17%")).toBeVisible();
    expect(onBillingIntervalChange).toHaveBeenCalledWith("yearly");
  });

  it("provides an accessible feature comparison table", () => {
    render(
      <PricingSection
        variant="table"
        plans={plans}
        billingIntervals={[
          { id: "monthly", label: "Monthly" },
          { id: "yearly", label: "Yearly" },
        ]}
        defaultBillingInterval="monthly"
      />,
    );

    expect(screen.getByRole("table", { name: "Plan comparison" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Starter" })).toBeVisible();
    expect(screen.getByRole("rowheader", { name: "Projects" })).toBeVisible();
    expect(screen.getAllByText("Not included")).not.toHaveLength(0);
  });

  it("renders empty collections and zero-valued prices without inventing a calculation", () => {
    const { container, rerender } = render(<PricingSection plans={[]} />);
    expect(container.querySelector(".puzzle-pricing__plans")).toBeNull();

    rerender(
      <PricingSection
        plans={[
          {
            id: "free",
            name: "Free",
            prices: [{ amount: 0, currency: "$" }],
          },
        ]}
      />,
    );
    expect(screen.getByText("0")).toBeVisible();
  });

  it("supports an explicitly supplied calculator and leaves estimates presentation-only otherwise", () => {
    const { rerender } = render(
      <PricingSection
        variant="slider"
        plans={[]}
        calculator={{ label: "Monthly events", min: 0, max: 100, initialValue: 25 }}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Monthly events" });
    expect(screen.getByText("25")).toBeVisible();
    fireEvent.change(slider, { target: { value: "40" } });
    expect(screen.getByText("40")).toBeVisible();
    expect(screen.queryByText(/\$/)).toBeNull();

    rerender(
      <PricingSection
        variant="calculator"
        plans={[]}
        calculator={{
          label: "Monthly events",
          min: 0,
          max: 100,
          initialValue: 25,
          renderEstimate: (value) => `$${value * 2}`,
        }}
      />,
    );
    expect(screen.getByText("$80")).toBeVisible();
  });

  it("rejects unknown billing intervals and invalid calculator bounds", () => {
    expect(() =>
      render(
        <PricingSection
          plans={[]}
          billingIntervals={[{ id: "monthly", label: "Monthly" }]}
          defaultBillingInterval="annual"
        />,
      ),
    ).toThrow('Unknown default billing interval "annual".');

    expect(() =>
      render(
        <PricingSection
          plans={[]}
          variant="calculator"
          calculator={{ label: "Seats", min: 10, max: 1 }}
        />,
      ),
    ).toThrow("Pricing calculator bounds");

    expect(() =>
      render(
        <PricingSection
          plans={[
            {
              id: "team",
              name: "Team",
              prices: [
                { intervalId: "monthly", amount: 20 },
                { intervalId: "yearly", amount: 200 },
              ],
            },
          ]}
        />,
      ),
    ).toThrow('Pass billingIntervals to select a price for plan "team".');
  });
});
