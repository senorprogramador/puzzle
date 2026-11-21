import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ProductShowcaseSection } from "./product-showcase";
import type {
  ProductShowcaseItem,
  ProductShowcaseVariant,
} from "./product-showcase.types";

const variants: ProductShowcaseVariant[] = [
  "split",
  "centered",
  "browser",
  "desktop",
  "mobile",
  "device-stack",
  "gallery",
  "tabs",
  "carousel",
  "sticky",
  "bento",
  "full-width",
  "layered",
  "editorial",
  "video",
  "interactive",
];

const items: ProductShowcaseItem[] = [
  {
    id: "workspace",
    title: "Workspace",
    description: "A shared project dashboard.",
    media: <img src="/workspace.png" alt="Project dashboard screenshot" />,
    caption: "Project overview",
    annotations: [
      {
        id: "milestones",
        label: "Milestones",
        description: "Review delivery dates and owners.",
      },
    ],
    featured: true,
  },
  {
    id: "workflows",
    title: "Workflows",
    description: "Automate routine handoffs.",
    media: <img src="/workflows.png" alt="Workflow builder screenshot" />,
  },
];

afterEach(cleanup);

describe("ProductShowcaseSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <ProductShowcaseSection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Workspace" })).toBeVisible();
  });

  it.each([
    ["browser", "browser"],
    ["desktop", "desktop"],
    ["mobile", "mobile"],
  ] as const)("uses the %s frame for that layout", (variant, frame) => {
    const { container } = render(
      <ProductShowcaseSection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-frame="${frame}"]`)).not.toBeNull();
  });

  it("supports keyboard navigation between product tabs", async () => {
    const user = userEvent.setup();
    render(<ProductShowcaseSection variant="tabs" items={items} />);

    const workspaceTab = screen.getByRole("tab", { name: "Workspace" });
    workspaceTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Workflows" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Automate routine handoffs.")).toBeVisible();
  });

  it("uses responsive UI carousel controls and pagination", () => {
    const { container } = render(
      <ProductShowcaseSection variant="carousel" items={items} />,
    );

    const carousel = container.querySelector(".puzzle-carousel");
    expect(carousel).toHaveAttribute("data-button-mobile", "aside");
    expect(carousel).toHaveAttribute("data-pager-mobile", "under");
    expect(
      screen.getByRole("button", { name: "Previous product" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Next product" }),
    ).toBeVisible();
  });

  it("omits empty lists and renders large item collections", () => {
    const { container, rerender } = render(
      <ProductShowcaseSection items={[]} />,
    );
    expect(container.querySelector(".puzzle-product-showcase__list")).toBeNull();

    const manyItems = Array.from({ length: 60 }, (_, index) => ({
      id: `item-${index}`,
      title: `Capability ${index}`,
      media: <span>Preview {index}</span>,
    }));
    rerender(<ProductShowcaseSection items={manyItems} />);

    expect(
      container.querySelectorAll(".puzzle-product-showcase__list > li"),
    ).toHaveLength(60);
  });
});
