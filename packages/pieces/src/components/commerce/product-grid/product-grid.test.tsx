import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ProductGridSection } from "./product-grid";
import type {
  ProductGridItem,
  ProductGridVariant,
} from "./product-grid.types";

const variants: ProductGridVariant[] = [
  "grid",
  "masonry",
  "featured",
  "horizontal",
  "carousel",
  "compact",
  "editorial",
  "collection",
  "category",
  "list",
  "asymmetric",
  "bento",
  "mixed",
  "minimal",
];

const items: ProductGridItem[] = [
  {
    id: "field-jacket",
    name: "Field Jacket",
    image: {
      src: "/field-jacket.png",
      alt: "Olive field jacket on a neutral background",
    },
    price: { amount: 129.5, currency: "USD" },
    compareAtPrice: { amount: 159.5, currency: "USD" },
    labels: [{ id: "new", content: "New" }],
    rating: { value: 4.7, count: 18 },
    category: "Outerwear",
    collection: "Trail",
    href: "/products/field-jacket",
    featured: true,
  },
  {
    id: "day-pack",
    name: "Day Pack",
    image: {
      src: "/day-pack.png",
      alt: "Canvas day pack with leather details",
    },
    price: { amount: 84, currency: "USD" },
    category: "Bags",
    collection: "Trail",
    action: <button type="button">Quick view</button>,
  },
];

afterEach(cleanup);

describe("ProductGridSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <ProductGridSection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Field Jacket" })).toBeVisible();
  });

  it("formats prices for the supplied locale and presents comparison prices without calculating discounts", () => {
    const { container } = render(
      <ProductGridSection variant="grid" items={items} locale="nl-NL" />,
    );
    const formattedPrice = new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "USD",
    }).format(129.5);
    const formattedCompareAtPrice = new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "USD",
    }).format(159.5);

    expect(
      container.querySelector(".puzzle-commerce__current-price")?.textContent,
    ).toBe(formattedPrice);
    expect(container.querySelector("del")?.textContent).toBe(
      formattedCompareAtPrice,
    );
    expect(screen.queryByText(/%/)).toBeNull();
    expect(
      screen.getByRole("link", { name: "Field Jacket" }),
    ).toHaveAttribute("href", "/products/field-jacket");
  });

  it("shows a clear placeholder for missing images and wraps long names", () => {
    render(
      <ProductGridSection
        items={[
          {
            id: "long-name",
            name: "Hand-finished weather-resistant everyday carry backpack",
            price: { amount: 0, currency: "USD" },
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Hand-finished weather-resistant everyday carry backpack image unavailable",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Hand-finished weather-resistant everyday carry backpack",
      }),
    ).toBeVisible();
    expect(screen.getByText("$0.00")).toBeVisible();
  });

  it("replaces a failed image request with a labeled placeholder", () => {
    const { container } = render(
      <ProductGridSection
        items={[
          {
            id: "broken-image",
            name: "Canvas Tote",
            image: { src: "/missing.jpg", alt: "Canvas tote" },
            price: { amount: 20, currency: "USD" },
          },
        ]}
      />,
    );

    fireEvent.error(container.querySelector("img")!);
    expect(
      screen.getByRole("img", { name: "Canvas Tote image unavailable" }),
    ).toBeVisible();
  });

  it("supports keyboard carousel controls and collection grouping", async () => {
    const user = userEvent.setup();
    render(<ProductGridSection variant="carousel" items={items} />);

    const next = screen.getByRole("button", { name: "Next product" });
    next.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: "Day Pack" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Next product" })).toBeDisabled();

    const { container, rerender } = render(
      <ProductGridSection variant="collection" items={items} />,
    );
    expect(screen.getByRole("heading", { name: "Trail" })).toBeVisible();
    rerender(<ProductGridSection items={[]} />);
    expect(container.querySelector(".puzzle-product-grid__list")).toBeNull();
  });

  it("omits empty and renders large product collections", () => {
    const { container, rerender } = render(<ProductGridSection items={[]} />);
    expect(container.querySelector(".puzzle-product-grid__list")).toBeNull();

    const manyItems: ProductGridItem[] = Array.from({ length: 60 }, (_, index) => ({
      id: `product-${index}`,
      name: `Product ${index}`,
      price: { amount: index, currency: "USD" },
    }));
    rerender(<ProductGridSection items={manyItems} />);

    expect(
      container.querySelectorAll(".puzzle-product-grid__list > li"),
    ).toHaveLength(60);
  });

  it("rejects invalid rating values", () => {
    const invalid: ProductGridItem = {
      id: "bad-rating",
      name: "Product",
      price: { amount: 10, currency: "USD" },
      rating: { value: 8, max: 5 },
    };

    expect(() => render(<ProductGridSection items={[invalid]} />)).toThrow(
      'Rating for item "bad-rating" must be between 0 and 5.',
    );
  });
});
