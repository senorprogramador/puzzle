import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { CategoriesSection } from "./categories";
import type {
  CategoriesVariant,
  CategoryItem,
} from "./categories.types";

const variants: CategoriesVariant[] = [
  "grid",
  "image-grid",
  "cards",
  "horizontal",
  "carousel",
  "editorial",
  "featured",
  "split",
  "list",
  "compact",
];

const items: CategoryItem[] = [
  {
    id: "lighting",
    title: "Lighting",
    description: "Lamps and fixtures for calm, considered rooms.",
    image: {
      src: "/lighting.png",
      alt: "Pendant lamp above a dining table",
    },
    href: "/collections/lighting",
    featured: true,
  },
  {
    id: "textiles",
    title: "Textiles",
    description: "Soft layers for everyday living.",
  },
];

afterEach(cleanup);

describe("CategoriesSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <CategoriesSection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Lighting" })).toBeVisible();
  });

  it("supports category links and missing images", () => {
    const { rerender } = render(<CategoriesSection items={items} />);

    expect(
      screen.getByRole("link", { name: /Lighting/ }),
    ).toHaveAttribute("href", "/collections/lighting");

    rerender(
      <CategoriesSection
        items={[{ id: "textiles", title: "Textiles" }]}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Textiles image unavailable" }),
    ).toBeVisible();
  });

  it("moves through the category carousel with keyboard-accessible controls", async () => {
    const user = userEvent.setup();
    render(<CategoriesSection variant="carousel" items={items} />);

    const next = screen.getByRole("button", { name: "Next category" });
    next.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: "Textiles" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Next category" })).toBeDisabled();
  });

  it("omits empty collections and handles large category sets", () => {
    const { container, rerender } = render(<CategoriesSection items={[]} />);
    expect(container.querySelector(".puzzle-categories__list")).toBeNull();

    const manyItems = Array.from({ length: 60 }, (_, index) => ({
      id: `category-${index}`,
      title: `Category ${index}`,
    }));
    rerender(<CategoriesSection items={manyItems} />);

    expect(
      container.querySelectorAll(".puzzle-categories__list > li"),
    ).toHaveLength(60);
  });
});
