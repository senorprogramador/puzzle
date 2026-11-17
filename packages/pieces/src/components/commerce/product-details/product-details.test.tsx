import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ProductDetailsSection } from "./product-details";
import type {
  ProductDetailsData,
  ProductDetailsVariant,
} from "./product-details.types";

const variants: ProductDetailsVariant[] = [
  "split",
  "gallery",
  "editorial",
  "tabs",
  "accordion",
  "specifications",
  "features",
  "comparison",
  "compact",
  "full-width",
  "sticky",
  "media-led",
];

const product: ProductDetailsData = {
  id: "pour-over",
  name: "Stoneware Pour-over Set",
  description: "A considered coffee ritual, made for slow mornings.",
  media: [
    {
      src: "/pour-over-front.png",
      alt: "Stoneware pour-over set in chalk",
    },
    {
      src: "/pour-over-detail.png",
      alt: "Close-up of the textured stoneware surface",
    },
  ],
  price: { amount: 68, currency: "USD" },
  compareAtPrice: { amount: 78, currency: "USD" },
  rating: { value: 4.8, count: 32 },
  labels: [{ id: "handmade", content: "Hand finished" }],
  availability: <p>Availability information supplied by the retailer.</p>,
  variantSelector: (
    <label>
      Glaze
      <select defaultValue="chalk">
        <option value="chalk">Chalk</option>
        <option value="sand">Sand</option>
      </select>
    </label>
  ),
  features: ["Glazed stoneware", "Reusable stainless filter"],
  specifications: [
    { id: "material", label: "Material", value: "Stoneware and steel" },
    { id: "capacity", label: "Capacity", value: "350 ml" },
  ],
  comparison: {
    comparisonName: "Compact pour-over",
    rows: [
      {
        id: "capacity",
        label: "Capacity",
        productValue: "350 ml",
        comparisonValue: "250 ml",
      },
    ],
  },
  actions: <button type="button">Choose glaze</button>,
};

afterEach(cleanup);

describe("ProductDetailsSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <ProductDetailsSection variant={variant} product={product} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(
      screen.getByRole("heading", { name: "Stoneware Pour-over Set" }),
    ).toBeVisible();
  });

  it("uses accessible keyboard-operable tabs for product details", async () => {
    const user = userEvent.setup();
    render(<ProductDetailsSection variant="tabs" product={product} />);

    const descriptionTab = screen.getByRole("tab", { name: "Description" });
    descriptionTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Features" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Reusable stainless filter")).toBeVisible();
    expect(screen.getByText("$68.00")).toBeVisible();
  });

  it("renders a semantic comparison table and consumer-supplied availability", () => {
    render(<ProductDetailsSection variant="comparison" product={product} />);

    expect(
      screen.getByRole("table", { name: "Product comparison" }),
    ).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Compact pour-over" }))
      .toBeVisible();
    expect(
      screen.getByText("Availability information supplied by the retailer."),
    ).toBeVisible();
  });

  it("keeps optional presentation slots optional", () => {
    render(
      <ProductDetailsSection
        product={{
          id: "plain",
          name: "Plain product",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Plain product" })).toBeVisible();
    expect(screen.queryByText(/in stock|available now/i)).toBeNull();
    expect(screen.getByText("Image unavailable")).toBeVisible();
  });
});
