import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { AmenityListSection } from "./amenity-list-section";
import type { AmenityCategory } from "../accommodation.types";

const categories: AmenityCategory[] = [
  {
    id: "comfort",
    name: "Comfort",
    items: [
      {
        id: "wifi",
        label: "High-speed Wi-Fi",
        description: "A reliable connection throughout the house.",
        content: <a href="/connect">Connection instructions</a>,
      },
      { id: "fireplace", label: "Wood-burning fireplace" },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen and dining",
    items: [{ id: "coffee", label: "Coffee maker" }],
  },
  { id: "empty", name: "Empty category", items: [] },
];

afterEach(cleanup);

describe("AmenityListSection", () => {
  it("renders the default expanded grid and omits empty categories", () => {
    const { container } = render(
      <AmenityListSection categories={categories} title="Amenities" />,
    );

    expect(container.querySelector("[data-variant]")).toHaveAttribute(
      "data-variant",
      "expanded",
    );
    expect(screen.getByRole("heading", { name: "Comfort" })).toBeVisible();
    expect(screen.getByText("A reliable connection throughout the house.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Connection instructions" })).toHaveAttribute(
      "href",
      "/connect",
    );
    expect(screen.queryByText("Empty category")).toBeNull();
  });

  it.each([
    ["compact", "grid"],
    ["compact", "list"],
    ["expanded", "grid"],
    ["expanded", "list"],
  ] as const)("supports the %s %s layout", (variant, layout) => {
    const { container } = render(
      <AmenityListSection
        categories={categories}
        variant={variant}
        layout={layout}
      />,
    );

    expect(container.querySelector(".puzzle-amenity-list")).toHaveClass(
      `puzzle-amenity-list--${layout}`,
    );
    expect(screen.getByText("High-speed Wi-Fi")).toBeVisible();
    const description = screen.queryByText(
      "A reliable connection throughout the house.",
    );
    if (variant === "expanded") {
      expect(description).toBeVisible();
    } else {
      expect(description).toBeNull();
    }
  });

  it("supports native collapsible groups with a keyboard-focusable summary", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AmenityListSection
        categories={categories.slice(0, 1)}
        collapsible
        defaultExpanded={false}
      />,
    );
    const details = container.querySelector("details")!;
    const summary = container.querySelector("summary")!;

    expect(details).not.toHaveAttribute("open");
    await user.tab();
    expect(summary).toHaveFocus();
    await user.click(summary);
    expect(details).toHaveAttribute("open");
    expect(screen.getByText("High-speed Wi-Fi")).toBeVisible();
  });

  it("keeps an empty collection valid and validates duplicate IDs", () => {
    const { container } = render(<AmenityListSection categories={[]} />);
    expect(
      container.querySelector(".puzzle-amenity-list__categories"),
    ).toBeNull();

    expect(() =>
      render(
        <AmenityListSection
          categories={[
            { id: "same", name: "First", items: [] },
            { id: "same", name: "Second", items: [] },
          ]}
        />,
      ),
    ).toThrow("Amenity category IDs must be non-empty and unique.");
  });

  it("server-renders grouped amenity content", () => {
    expect(
      renderToString(
        <AmenityListSection categories={categories} collapsible />,
      ),
    ).toContain("High-speed Wi-Fi");
  });
});
