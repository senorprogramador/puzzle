import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComparisonSection } from "./comparison";
import type {
  ComparisonFeature,
  ComparisonOption,
  ComparisonVariant,
} from "./comparison.types";

const variants: ComparisonVariant[] = [
  "table",
  "cards",
  "split",
  "versus",
  "checklist",
  "feature-matrix",
  "pricing",
  "highlighted",
  "horizontal",
  "vertical",
  "compact",
  "interactive",
];
const options: ComparisonOption[] = [
  { id: "basic", title: "Basic" },
  { id: "pro", title: "Pro", featured: true },
];
const features: ComparisonFeature[] = [
  {
    id: "support",
    label: "Priority support",
    values: { basic: false, pro: true },
  },
];

describe("ComparisonSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(
      variant === "interactive" ? (
        <ComparisonSection
          variant={variant}
          options={options}
          features={features}
          defaultSelectedOptionId="basic"
        />
      ) : (
        <ComparisonSection
          variant={variant}
          options={options}
          features={features}
        />
      ),
    );
    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getAllByText("Priority support").length).toBeGreaterThan(0);
  });

  it("renders an accessible comparison table", () => {
    render(
      <ComparisonSection
        title="Plans"
        comparisonLabel="Plan comparison"
        options={options}
        features={features}
      />,
    );
    expect(screen.getByRole("table", { name: "Plan comparison" })).toBeVisible();
    expect(screen.getByText("No")).toBeVisible();
    expect(screen.getByText("Yes")).toBeVisible();
  });

  it("omits the comparison table for empty options", () => {
    const { container } = render(
      <ComparisonSection options={[]} features={features} />,
    );
    expect(container.querySelector("table")).toBeNull();
  });
});
