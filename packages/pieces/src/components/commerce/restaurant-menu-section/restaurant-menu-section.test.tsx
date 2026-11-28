import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  RestaurantMenu,
  RestaurantMenuDietaryFilter,
} from "../restaurant-menu.types";
import { RestaurantMenuSection } from "./restaurant-menu-section";

afterEach(cleanup);

const menus: RestaurantMenu[] = [
  {
    id: "lunch",
    title: "Lunch menu",
    description: "Available from noon.",
    categories: [
      {
        id: "small-plates",
        title: "Small plates",
        dishes: [
          {
            id: "olives",
            name: "Marinated olives",
            description: "Citrus, herbs, and warm bread.",
            price: { amount: 6, currency: "EUR" },
            dietaryTags: [{ id: "plant-based", label: "Plant-based" }],
          },
          {
            id: "cheese",
            name: "Aged cheese",
            description: "Contains peanuts only in the description text.",
            price: { amount: 9.5, currency: "USD" },
          },
        ],
      },
      {
        id: "mains",
        title: "Mains",
        dishes: [
          {
            id: "garden-bowl",
            name: "Garden bowl",
            price: { amount: 14, currency: "GBP" },
            dietaryTags: [{ id: "plant-based", label: "Plant-based" }],
            allergens: [{ id: "sesame", label: "Sesame" }],
          },
        ],
      },
    ],
  },
  {
    id: "dinner",
    title: "Dinner menu",
    categories: [
      {
        id: "desserts",
        title: "Desserts",
        dishes: [
          {
            id: "pear-tart",
            name: "Pear tart",
            price: { amount: 8, currency: "EUR" },
          },
        ],
      },
    ],
  },
];

const dietaryFilters: RestaurantMenuDietaryFilter[] = [
  { id: "plant-based", label: "Plant-based" },
];

describe("RestaurantMenuSection", () => {
  it("renders multiple menus with category navigation and supplied prices", () => {
    render(
      <RestaurantMenuSection
        title="Today's menu"
        menus={menus}
        dietaryFilters={dietaryFilters}
        locale="en-GB"
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Menu categories" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Lunch menu" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Dinner menu" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Small plates" })).toHaveAttribute(
      "href",
      expect.stringMatching(/^#/),
    );
    expect(screen.getByText(/€6\.00/)).toBeVisible();
    expect(screen.getByText(/US\$9\.50/)).toBeVisible();
    expect(screen.getByText(/£14\.00/)).toBeVisible();
    expect(screen.getByText("Sesame")).toBeVisible();
    expect(screen.getAllByText("Allergens")).toHaveLength(1);
    expect(screen.queryByText("Peanuts", { exact: true })).toBeNull();
  });

  it("keeps a single category navigable and points to its rendered section", () => {
    const oneCategory = [menus[0]!] as const;
    render(
      <RestaurantMenuSection
        menus={[
          {
            ...oneCategory[0],
            categories: oneCategory[0].categories.slice(0, 1),
          },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: "Small plates" });
    const targetId = link.getAttribute("href")?.slice(1);
    expect(targetId).toBeTruthy();
    expect(document.getElementById(targetId!)).toHaveTextContent(
      "Marinated olives",
    );
  });

  it("filters only by supplied dietary tags and reports empty results", async () => {
    const user = userEvent.setup();
    const onDietaryFilterChange = vi.fn();
    render(
      <RestaurantMenuSection
        menus={menus}
        dietaryFilters={dietaryFilters}
        onDietaryFilterChange={onDietaryFilterChange}
      />,
    );

    expect(screen.getByText("Aged cheese")).toBeVisible();
    await user.click(
      screen.getByRole("combobox", { name: "Filter by dietary preference" }),
    );
    await user.click(screen.getByRole("option", { name: "Plant-based" }));

    expect(screen.getByText("Marinated olives")).toBeVisible();
    expect(screen.getByText("Garden bowl")).toBeVisible();
    expect(screen.queryByText("Aged cheese")).toBeNull();
    expect(onDietaryFilterChange).toHaveBeenLastCalledWith("plant-based");

    await user.click(
      screen.getByRole("combobox", { name: "Filter by dietary preference" }),
    );
    await user.click(screen.getByRole("option", { name: "All dishes" }));
    expect(screen.getByText("Aged cheese")).toBeVisible();
    expect(onDietaryFilterChange).toHaveBeenLastCalledWith(null);
  });

  it("supports controlled dietary filtering", async () => {
    const user = userEvent.setup();
    const onDietaryFilterChange = vi.fn();
    render(
      <RestaurantMenuSection
        menus={menus}
        dietaryFilters={dietaryFilters}
        selectedDietaryTagId="plant-based"
        onDietaryFilterChange={onDietaryFilterChange}
      />,
    );

    expect(screen.queryByText("Aged cheese")).toBeNull();
    await user.click(
      screen.getByRole("combobox", { name: "Filter by dietary preference" }),
    );
    await user.click(screen.getByRole("option", { name: "All dishes" }));
    expect(onDietaryFilterChange).toHaveBeenCalledWith(null);
    expect(screen.queryByText("Aged cheese")).toBeNull();
  });

  it("renders an empty state and keeps static menu links in server output", () => {
    render(<RestaurantMenuSection menus={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "No menu dishes are available.",
    );

    const markup = renderToStaticMarkup(
      <RestaurantMenuSection menus={[menus[0]!]} />,
    );
    expect(markup).toContain("href=\"#");
    expect(markup).toContain("Small plates");
    expect(markup).toContain("Marinated olives");
  });

  it("rejects unknown controlled filters and duplicate menu identifiers", () => {
    expect(() =>
      render(
        <RestaurantMenuSection
          menus={menus}
          dietaryFilters={dietaryFilters}
          selectedDietaryTagId="unknown"
        />,
      ),
    ).toThrow("The selected dietary tag must be present in dietaryFilters.");

    expect(() =>
      render(
        <RestaurantMenuSection
          menus={[
            menus[0]!,
            { ...menus[1]!, id: "lunch" },
          ]}
        />,
      ),
    ).toThrow("Restaurant menu IDs must be non-empty and unique.");
  });
});
