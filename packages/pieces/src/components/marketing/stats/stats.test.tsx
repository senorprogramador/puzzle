import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatsSection } from "./stats";
import type { StatItem, StatsVariant } from "./stats.types";

const variants: StatsVariant[] = [
  "grid",
  "inline",
  "cards",
  "split",
  "centered",
  "featured",
  "horizontal",
  "vertical",
  "dashboard",
  "comparison",
  "progress",
  "animated",
];
const items: StatItem[] = [
  {
    id: "users",
    label: "Active users",
    value: 1200,
    prefix: "+",
    suffix: "%",
    description: "Compared with last quarter.",
    trend: { direction: "up", label: "Growing" },
    progress: 75,
  },
];

describe("StatsSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(<StatsSection variant={variant} items={items} />);
    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("Active users")).toBeVisible();
    expect(screen.getByRole("progressbar", { name: "Active users progress" })).toHaveValue(75);
  });

  it("does not render a list for empty data", () => {
    const { container } = render(<StatsSection items={[]} />);
    expect(container.querySelector(".puzzle-stats__list")).toBeNull();
  });
});
