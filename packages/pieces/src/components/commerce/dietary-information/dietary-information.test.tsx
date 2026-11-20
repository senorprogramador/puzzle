import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Allergen, DietaryTag } from "../restaurant-menu.types";
import { DietaryInformation } from "./dietary-information";

beforeEach(() => {
  const rect = new DOMRect(0, 0, 100, 40);

  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rect);
  vi.spyOn(Element.prototype, "getClientRects").mockReturnValue([
    rect,
  ] as unknown as DOMRectList);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const tags: DietaryTag[] = [
  {
    id: "plant-based",
    label: "Plant-based",
    icon: <span data-testid="plant-icon">P</span>,
    description: "Label supplied by the restaurant.",
  },
];

const allergens: Allergen[] = [
  {
    id: "sesame",
    label: "Sesame",
    icon: <span data-testid="sesame-icon">S</span>,
    description: "Allergen information supplied by the restaurant.",
  },
];

describe("DietaryInformation", () => {
  it("shows readable dietary and allergen labels with decorative icons", () => {
    render(<DietaryInformation tags={tags} allergens={allergens} />);

    expect(screen.getByText("Dietary")).toBeVisible();
    expect(screen.getByText("Allergens")).toBeVisible();
    expect(screen.getByText("Plant-based")).toBeVisible();
    expect(screen.getByText("Sesame")).toBeVisible();
    expect(screen.getByTestId("plant-icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(
      screen.queryByText("Label supplied by the restaurant."),
    ).toBeNull();
  });

  it("supports expanded descriptions and configurable headings", () => {
    const { container } = render(
      <DietaryInformation
        tags={tags}
        allergens={allergens}
        variant="expanded"
        dietaryHeading="Dietary notes"
        allergenHeading="Allergen notes"
      />,
    );

    expect(container.querySelector("[data-variant]")).toHaveAttribute(
      "data-variant",
      "expanded",
    );
    expect(screen.getByText("Dietary notes")).toBeVisible();
    expect(screen.getByText("Allergen notes")).toBeVisible();
    expect(screen.getByText("Label supplied by the restaurant.")).toBeVisible();
    expect(
      screen.getByText("Allergen information supplied by the restaurant."),
    ).toBeVisible();
  });

  it("opens optional details with the keyboard and closes with Escape", async () => {
    const user = userEvent.setup();
    render(
      <DietaryInformation
        tags={tags}
        allergens={allergens}
        showDetailsPopover
        detailsLabel="Read dietary details"
      />,
    );
    const trigger = screen.getByRole("button", {
      name: "Read dietary details",
    });

    trigger.focus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("dialog", {
      name: "Dietary and allergen information",
    });
    expect(dialog).toBeVisible();
    expect(
      screen.getByText("Allergen information supplied by the restaurant."),
    ).toBeVisible();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders no empty wrapper and validates duplicate identifiers", () => {
    const { container } = render(<DietaryInformation />);
    expect(container.firstChild).toBeNull();

    expect(() =>
      render(
        <DietaryInformation
          tags={[
            { id: "same", label: "First" },
            { id: "same", label: "Second" },
          ]}
        />,
      ),
    ).toThrow("Dietary tag IDs must be non-empty and unique.");
  });

  it("server-renders only the supplied dietary and allergen information", () => {
    const markup = renderToStaticMarkup(
      <DietaryInformation tags={tags} allergens={allergens} />,
    );

    expect(markup).toContain("Plant-based");
    expect(markup).toContain("Sesame");
    expect(markup).not.toContain("contains");
  });
});
