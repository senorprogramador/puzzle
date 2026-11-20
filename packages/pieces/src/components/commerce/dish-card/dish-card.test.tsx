import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import type { RestaurantDish } from "../restaurant-menu.types";
import { DishCard } from "./dish-card";

afterEach(cleanup);

const dish: RestaurantDish = {
  id: "garden-bowl",
  name: "Garden bowl",
  description: "Roasted vegetables with herbs and a bright citrus dressing.",
  price: { amount: 14.5, currency: "EUR" },
  image: {
    src: "/images/garden-bowl.jpg",
    alt: "A bowl of roasted vegetables with fresh herbs",
    width: 800,
    height: 600,
  },
  dietaryTags: [{ id: "plant-based", label: "Plant-based" }],
  allergens: [{ id: "sesame", label: "Sesame" }],
  featured: true,
  popular: true,
  portionSize: "Main course",
};

describe("DishCard", () => {
  it("renders the standard dish, price, image, portion, and supplied dietary details", () => {
    render(<DishCard dish={dish} locale="de-DE" />);

    expect(screen.getByRole("article")).toHaveAttribute(
      "data-dish-variant",
      "standard",
    );
    expect(screen.getByRole("heading", { name: "Garden bowl" })).toBeVisible();
    expect(screen.getByText(/14,50/)).toBeVisible();
    expect(
      screen.getByRole("img", {
        name: "A bowl of roasted vegetables with fresh herbs",
      }),
    ).toHaveAttribute("loading", "lazy");
    expect(screen.getByText("Main course")).toBeVisible();
    expect(screen.getByText("Plant-based")).toBeVisible();
    expect(screen.getByText("Sesame")).toBeVisible();
    expect(screen.getByText("Featured")).toBeVisible();
    expect(screen.getByText("Popular")).toBeVisible();
  });

  it.each(["compact", "standard", "featured"] as const)(
    "supports the %s presentation",
    (variant) => {
      render(<DishCard dish={dish} variant={variant} />);

      expect(screen.getByRole("article")).toHaveAttribute(
        "data-dish-variant",
        variant,
      );
    },
  );

  it("renders without an image and supports custom media, content, and action slots", () => {
    const { rerender, container } = render(
      <DishCard
        dish={{ ...dish, image: undefined, dietaryTags: [], allergens: [] }}
      />,
    );

    expect(container.querySelector(".puzzle-dish-card__media")).toBeNull();

    rerender(
      <DishCard
        dish={dish}
        mediaSlot={<span>Seasonal illustration</span>}
        contentSlot={<p>Chef's note supplied by the menu.</p>}
        actions={<a href="/menu/contact">Ask about this dish</a>}
      />,
    );

    expect(screen.getByText("Seasonal illustration")).toBeVisible();
    expect(screen.getByText("Chef's note supplied by the menu.")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Ask about this dish" }),
    ).toHaveAttribute("href", "/menu/contact");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("supports a custom heading level and server rendering", () => {
    const markup = renderToStaticMarkup(
      <DishCard dish={dish} headingAs="h5" locale="en-GB" />,
    );

    expect(markup).toContain("<h5");
    expect(markup).toContain("Garden bowl");
    expect(markup).toContain("€14.50");
    expect(markup).toContain("Featured");
  });
});
