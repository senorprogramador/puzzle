import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AspectRatio } from "./index";

describe("AspectRatio (browser)", () => {
  it("maintains a 16:9 ratio at different widths", () => {
    render(
      <div style={{ width: "320px" }}>
        <AspectRatio ratio={16 / 9} data-testid="aspect-ratio">
          <div>Content</div>
        </AspectRatio>
      </div>,
    );

    const element = screen.getByTestId("aspect-ratio");
    const bounds = element.getBoundingClientRect();

    expect(bounds.width).toBeCloseTo(320);
    expect(bounds.height).toBeCloseTo(180);
  });

  it("maintains a 4:3 ratio", () => {
    render(
      <div style={{ width: "400px" }}>
        <AspectRatio ratio={4 / 3} data-testid="aspect-ratio">
          <div>Content</div>
        </AspectRatio>
      </div>,
    );

    const bounds = screen.getByTestId("aspect-ratio").getBoundingClientRect();

    expect(bounds.width).toBeCloseTo(400);
    expect(bounds.height).toBeCloseTo(300);
  });

  it("allows children to fill the entire container", () => {
    render(
      <div style={{ width: "320px" }}>
        <AspectRatio ratio={16 / 9} data-testid="aspect-ratio">
          <div data-testid="content">Content</div>
        </AspectRatio>
      </div>,
    );

    const container = screen
      .getByTestId("aspect-ratio")
      .getBoundingClientRect();

    const content = screen.getByTestId("content").getBoundingClientRect();

    expect(content.width).toBeCloseTo(container.width);
    expect(content.height).toBeCloseTo(container.height);
    expect(content.x).toBeCloseTo(container.x);
    expect(content.y).toBeCloseTo(container.y);
  });
});
