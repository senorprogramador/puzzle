import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { HouseRulesSection } from "./house-rules-section";
import type { HouseRuleCategory } from "./house-rules-section.types";

afterEach(cleanup);

const categories: HouseRuleCategory[] = [
  {
    id: "arrival",
    title: "Arrival and departure",
    description: "Plan arrival with your host.",
    rules: [
      {
        id: "check-in",
        label: "Check-in",
        value: "From 3:00 PM",
        description: "Share your estimated arrival time.",
      },
      {
        id: "check-out",
        label: "Check-out",
        value: "By 10:00 AM",
      },
    ],
  },
  {
    id: "house",
    title: "Around the house",
    rules: [
      { id: "pets", label: "Pets", value: "Ask before arrival" },
      { id: "smoking", label: "Smoking", value: "Not permitted" },
      { id: "parking", label: "Parking", value: "One space is included" },
    ],
  },
];

describe("HouseRulesSection", () => {
  it("renders categorized rule values and expanded descriptions", () => {
    render(
      <HouseRulesSection
        title="Before you arrive"
        categories={categories}
        variant="expanded"
      />,
    );

    expect(screen.getByRole("heading", { name: "Before you arrive" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Arrival and departure" })).toBeInTheDocument();
    expect(screen.getByText("From 3:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Share your estimated arrival time.")).toBeInTheDocument();
    expect(screen.getByText("Not permitted")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("omits supporting copy in compact mode and supports native disclosure", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <HouseRulesSection
        categories={categories}
        variant="compact"
        collapsible
      />,
    );

    expect(
      screen.queryByText("Share your estimated arrival time."),
    ).not.toBeInTheDocument();
    const details = container.querySelector("details")!;
    expect(details).not.toHaveAttribute("open");

    await user.click(screen.getByText("Arrival and departure"));
    expect(details).toHaveAttribute("open");
  });

  it("supports empty data and server rendering", () => {
    render(<HouseRulesSection categories={[]} emptyState="Rules are pending." />);
    expect(screen.getByRole("status")).toHaveTextContent("Rules are pending.");

    const markup = renderToStaticMarkup(
      <HouseRulesSection categories={categories} collapsible defaultOpen />,
    );
    expect(markup).toContain("<details open");
    expect(markup).toContain("Arrival and departure");
  });

  it("rejects duplicate category and rule IDs", () => {
    expect(() =>
      render(
        <HouseRulesSection categories={[categories[0]!, categories[0]!]} />,
      ),
    ).toThrow("House rule categories IDs must be non-empty and unique.");

    expect(() =>
      render(
        <HouseRulesSection
          categories={[
            {
              id: "duplicate-rules",
              title: "House",
              rules: [
                { id: "pets", label: "Pets", value: "Allowed" },
                { id: "pets", label: "Pets", value: "Not allowed" },
              ],
            },
          ]}
        />,
      ),
    ).toThrow(
      'House rules in "duplicate-rules" IDs must be non-empty and unique.',
    );
  });
});
