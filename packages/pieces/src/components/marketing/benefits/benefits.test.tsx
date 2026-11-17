import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BenefitsSection } from "./benefits";
import type { BenefitItem, BenefitsVariant } from "./benefits.types";

const variants: BenefitsVariant[] = [
  "grid",
  "split",
  "list",
  "cards",
  "icons",
  "numbered",
  "alternating",
  "checklist",
  "editorial",
  "featured",
  "compact",
  "comparison",
];
const items: BenefitItem[] = [
  {
    id: "faster",
    title: "Move faster",
    description: "Spend more time on important work.",
    featured: true,
  },
];

describe("BenefitsSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(
      <BenefitsSection variant={variant} items={items} />,
    );
    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("heading", { name: /Move faster/ })).toBeVisible();
  });

  it("omits a collection when there are no benefits", () => {
    const { container } = render(<BenefitsSection items={[]} />);
    expect(container.querySelector(".puzzle-benefits__list")).toBeNull();
  });
});
