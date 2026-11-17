import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CartSummarySection } from "./cart-summary";
import type {
  CartSummaryItem,
  CartSummaryVariant,
} from "./cart-summary.types";

const variants: CartSummaryVariant[] = [
  "sidebar",
  "compact",
  "full",
  "card",
  "sticky",
  "checkout",
  "split",
  "minimal",
  "detailed",
  "mobile",
];

const items: CartSummaryItem[] = [
  {
    id: "mug",
    name: "Stoneware mug",
    quantity: 2,
    unitPrice: { amount: 24, currency: "USD" },
    image: { src: "/mug.png", alt: "White stoneware mug" },
    href: "/products/mug",
  },
  {
    id: "spoon",
    name: "Measuring spoon",
    quantity: 0,
    unitPrice: { amount: 6, currency: "USD" },
    lineTotal: { amount: 0, currency: "USD" },
  },
];

afterEach(cleanup);

describe("CartSummarySection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <CartSummarySection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Stoneware mug" })).toBeVisible();
  });

  it("presents supplied totals and quantities without calculating line or order amounts", () => {
    render(
      <CartSummarySection
        items={items}
        totals={{
          subtotal: { amount: 54, currency: "USD" },
          discounts: [
            {
              id: "welcome",
              label: "Welcome offer",
              amount: { amount: -5, currency: "USD" },
            },
          ],
          shipping: { amount: 0, currency: "USD" },
          total: { amount: 49, currency: "USD" },
        }}
        actions={<button type="button">Continue</button>}
      />,
    );

    expect(screen.getByText("Quantity: 0")).toBeVisible();
    expect(screen.getByText("$54.00")).toBeVisible();
    expect(screen.getByText("-$5.00")).toBeVisible();
    expect(screen.getAllByText("$0.00")).toHaveLength(2);
    expect(screen.getByText("$49.00")).toBeVisible();
    expect(screen.queryByText("$48.00")).toBeNull();
    expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
  });

  it("renders a localized empty state and does not show supplied totals for an empty cart", () => {
    render(
      <CartSummarySection
        items={[]}
        totals={{ total: { amount: 40, currency: "USD" } }}
        emptyState={<p>No selected items.</p>}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No selected items.");
    expect(screen.queryByText("$40.00")).toBeNull();
  });

  it("handles empty and large item collections", () => {
    const { container, rerender } = render(<CartSummarySection items={[]} />);
    expect(container.querySelector(".puzzle-cart-summary__items")).toBeNull();

    const manyItems = Array.from({ length: 60 }, (_, index) => ({
      id: `item-${index}`,
      name: `Item ${index}`,
      quantity: index,
      unitPrice: { amount: index, currency: "USD" },
    }));
    rerender(<CartSummarySection items={manyItems} />);

    expect(
      container.querySelectorAll(".puzzle-cart-summary__items > li"),
    ).toHaveLength(60);
  });

  it.each([-1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid quantity %s",
    (quantity) => {
      expect(() =>
        render(
          <CartSummarySection
            items={[
              {
                id: "invalid-quantity",
                name: "Invalid item",
                quantity,
                unitPrice: { amount: 10, currency: "USD" },
              },
            ]}
          />,
        ),
      ).toThrow(
        'Quantity for cart item "invalid-quantity" must be a non-negative safe integer.',
      );
    },
  );
});
