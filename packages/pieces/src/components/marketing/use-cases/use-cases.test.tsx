import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { UseCasesSection } from "./use-cases";
import type { UseCaseItem, UseCasesVariant } from "./use-cases.types";

const variants: UseCasesVariant[] = [
  "grid",
  "cards",
  "tabs",
  "split",
  "alternating",
  "persona",
  "industry",
  "bento",
  "featured",
  "list",
  "editorial",
  "carousel",
  "categorized",
];

const items: UseCaseItem[] = [
  {
    id: "product",
    title: "Product teams",
    description: "Coordinate releases from one shared plan.",
    persona: "Product manager",
    industry: "Software",
    category: "Planning",
    benefits: ["Shared milestones", "Clear ownership"],
    media: <span>Roadmap preview</span>,
    featured: true,
  },
  {
    id: "operations",
    title: "Operations teams",
    description: "Connect recurring work to measurable outcomes.",
    persona: "Operations lead",
    industry: "Services",
    category: "Delivery",
  },
];

afterEach(cleanup);

describe("UseCasesSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <UseCasesSection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Product teams" })).toBeVisible();
  });

  it("filters use cases by a category and supports keyboard-operable tabs", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <UseCasesSection items={items} filterable />,
    );

    await user.selectOptions(screen.getByLabelText("Category"), "Delivery");
    expect(screen.getByText("Operations teams")).toBeVisible();
    expect(screen.queryByText("Product teams")).toBeNull();

    rerender(<UseCasesSection variant="tabs" items={items} />);
    const productTab = screen.getByRole("tab", { name: "Product teams" });
    productTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Operations teams" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("omits empty collections and handles large item sets", () => {
    const { container, rerender } = render(<UseCasesSection items={[]} />);
    expect(container.querySelector(".puzzle-use-cases__list")).toBeNull();

    const manyItems = Array.from({ length: 60 }, (_, index) => ({
      id: `case-${index}`,
      title: `Use case ${index}`,
    }));
    rerender(<UseCasesSection items={manyItems} />);

    expect(
      container.querySelectorAll(".puzzle-use-cases__list > li"),
    ).toHaveLength(60);
  });
});
