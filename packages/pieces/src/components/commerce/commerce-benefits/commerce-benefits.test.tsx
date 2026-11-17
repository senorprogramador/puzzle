import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CommerceBenefitsSection } from "./commerce-benefits";
import type {
  CommerceBenefitItem,
  CommerceBenefitsVariant,
} from "./commerce-benefits.types";

const variants: CommerceBenefitsVariant[] = [
  "grid",
  "inline",
  "icons",
  "cards",
  "banner",
  "split",
  "compact",
  "trust",
  "shipping",
  "service",
];

const items: CommerceBenefitItem[] = [
  {
    id: "delivery",
    title: "Delivery options",
    description: "Show delivery details configured for this store.",
    icon: <span aria-hidden="true">D</span>,
    kind: "shipping",
    label: "Store-provided",
    href: "/delivery",
  },
  {
    id: "returns",
    title: "Returns information",
    description: "Add the return policy your team publishes.",
    kind: "returns",
    action: <button type="button">Read policy</button>,
  },
];

afterEach(cleanup);

describe("CommerceBenefitsSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <CommerceBenefitsSection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("Delivery options")).toBeVisible();
  });

  it("uses supplied links, actions, and labels", () => {
    render(<CommerceBenefitsSection variant="cards" items={items} />);

    expect(
      screen.getByRole("link", { name: /Delivery options/ }),
    ).toHaveAttribute("href", "/delivery");
    expect(screen.getByRole("button", { name: "Read policy" })).toBeVisible();
    expect(screen.getByText("Store-provided")).toBeVisible();
  });

  it("does not generate commerce promises and handles empty or large collections", () => {
    const { container, rerender } = render(
      <CommerceBenefitsSection items={[]} />,
    );
    expect(container.querySelector(".puzzle-commerce-benefits__list")).toBeNull();
    expect(screen.queryByText(/free shipping|lifetime warranty|secure checkout/i))
      .toBeNull();

    const manyItems: CommerceBenefitItem[] = Array.from(
      { length: 60 },
      (_, index) => ({
        id: `benefit-${index}`,
        title: `Store detail ${index}`,
      }),
    );
    rerender(<CommerceBenefitsSection items={manyItems} />);

    expect(
      container.querySelectorAll(".puzzle-commerce-benefits__list > li"),
    ).toHaveLength(60);
  });
});
