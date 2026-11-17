import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturesSection } from "./features";
import type { FeatureItem, FeaturesVariant } from "./features.types";

const variants: FeaturesVariant[] = [
  "grid",
  "bento",
  "alternating",
  "split",
  "cards",
  "icons",
  "numbered",
  "tabs",
  "accordion",
  "sticky",
  "horizontal",
  "vertical",
  "media-grid",
  "asymmetric",
  "editorial",
  "compact",
  "full-width",
];
const items: FeatureItem[] = [
  {
    id: "automation",
    title: "Automation",
    description: "Reduce repetitive work.",
    icon: <span>Icon</span>,
    featured: true,
  },
];

describe("FeaturesSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(
      <FeaturesSection variant={variant} items={items} />,
    );
    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    if (variant === "tabs") {
      expect(screen.getByRole("tab", { name: "Automation" })).toBeVisible();
    } else {
      expect(screen.getByRole("heading", { name: /Automation/ })).toBeVisible();
    }
  });

  it("uses an empty collection without rendering an empty list", () => {
    const { container } = render(<FeaturesSection items={[]} />);
    expect(container.querySelector(".puzzle-features__list")).toBeNull();
  });
});
