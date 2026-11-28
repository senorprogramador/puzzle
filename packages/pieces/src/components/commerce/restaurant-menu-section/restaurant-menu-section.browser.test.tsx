import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import type { RestaurantDish, RestaurantMenu } from "../restaurant-menu.types";
import { RestaurantMenuSection } from "./restaurant-menu-section";

afterEach(cleanup);

const image: NonNullable<RestaurantDish["image"]> = {
  src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'/%3E",
  alt: "A plated seasonal dish",
};

const dishes: RestaurantDish[] = Array.from({ length: 6 }, (_, index) => ({
  id: `dish-${index}`,
  name: `Seasonal dish ${index + 1} with an intentionally long menu name`,
  description:
    "Ingredients and preparation details are supplied by the restaurant. ".repeat(
      2,
    ),
  price: {
    amount: index * 3.75 + 8,
    currency: ["EUR", "USD", "GBP"][index % 3]!,
  },
  image: index === 0 ? image : undefined,
  dietaryTags:
    index % 2 === 0
      ? [{ id: "plant-based", label: "Plant-based" }]
      : undefined,
  allergens:
    index === 1 ? [{ id: "sesame", label: "Sesame" }] : undefined,
  featured: index === 0,
  popular: index === 1,
  portionSize: index % 2 === 0 ? "Main course" : undefined,
}));

const menu: RestaurantMenu[] = [
  {
    id: "dinner",
    title: "Dinner with a deliberately long menu title",
    categories: Array.from({ length: 8 }, (_, index) => ({
      id: `category-${index}`,
      title: `Category ${index + 1} with a long category title`,
      description: "Seasonal dishes described by the restaurant.",
      dishes,
    })),
  },
];

describe("RestaurantMenuSection browser behavior", () => {
  it("remains within the restaurant viewport matrix with many long menu items", async () => {
    const { container } = render(
      <RestaurantMenuSection
        title="A restaurant menu with long section copy"
        menus={menu}
        dietaryFilters={[{ id: "plant-based", label: "Plant-based" }]}
        locale="en-GB"
      />,
    );
    const section = container.querySelector<HTMLElement>(
      ".puzzle-restaurant-menu",
    )!;
    const categoriesGrid = container.querySelector<HTMLElement>(
      ".puzzle-restaurant-menu__categories",
    )!;
    const dishesGrid = container.querySelector<HTMLElement>(
      ".puzzle-restaurant-menu__dishes",
    )!;
    const categoryNavigation = screen.getByRole("navigation", {
      name: "Menu categories",
    });

    for (const [width, height] of [
      [320, 568],
      [375, 812],
      [430, 932],
      [540, 900],
      [768, 1024],
      [900, 900],
      [1024, 1366],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
    ] as const) {
      await page.viewport(width, height);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
      expect(categoryNavigation.scrollWidth).toBeLessThanOrEqual(
        categoryNavigation.clientWidth,
      );
      expect(dishesGrid.scrollWidth).toBeLessThanOrEqual(dishesGrid.clientWidth);
    }

    await page.viewport(375, 812);
    expect(
      getComputedStyle(dishesGrid).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);
    expect(getComputedStyle(categoryNavigation.querySelector("ul")!).flexWrap).toBe(
      "wrap",
    );

    await page.viewport(1440, 900);
    expect(
      getComputedStyle(categoriesGrid)
        .gridTemplateColumns.trim()
        .split(/\s+/).length,
    ).toBeGreaterThan(1);
  });

  it("uses a fluid dish grid when a category has enough available width", async () => {
    render(
      <RestaurantMenuSection
        menus={[
          {
            ...menu[0]!,
            categories: [menu[0]!.categories[0]!],
          },
        ]}
      />,
    );
    await page.viewport(1440, 900);

    const dishesGrid = document.querySelector<HTMLElement>(
      ".puzzle-restaurant-menu__dishes",
    )!;
    expect(
      getComputedStyle(dishesGrid).gridTemplateColumns.trim().split(/\s+/)
        .length,
    ).toBeGreaterThan(1);
  });

  it("supports keyboard navigation and optional dietary filtering", async () => {
    const user = userEvent.setup();
    render(
      <RestaurantMenuSection
        menus={menu}
        dietaryFilters={[{ id: "plant-based", label: "Plant-based" }]}
      />,
    );

    const categoryLink = screen.getByRole("link", {
      name: "Category 1 with a long category title",
    });
    categoryLink.focus();
    await user.keyboard("{Enter}");
    expect(window.location.hash).toBe(categoryLink.getAttribute("href"));

    await user.click(
      screen.getByRole("combobox", { name: "Filter by dietary preference" }),
    );
    await user.click(screen.getByRole("option", { name: "Plant-based" }));
    expect(screen.getAllByRole("article")).toHaveLength(24);
  });
});
