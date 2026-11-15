import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./index";

describe("Skeleton", () => {
  it("renders an aria-hidden placeholder with default dimensions and radius", () => {
    render(<Skeleton />);

    const skeleton = screen.getByText("", { selector: "span" });
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass("puzzle-skeleton", "puzzle-skeleton-standard");
    expect(skeleton).toHaveStyle({ width: "100%", height: "1rem" });
  });

  it("supports custom dimensions, radius, and class", () => {
    const { container } = render(
      <Skeleton width={120} height={24} radius="full" className="custom" />,
    );

    const skeleton = container.querySelector("span");
    expect(skeleton).toHaveClass("puzzle-skeleton-full", "custom");
    expect(skeleton).toHaveStyle({ width: "120px", height: "24px" });
  });
});
