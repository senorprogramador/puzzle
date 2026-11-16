import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Background } from "./index";

describe("Background", () => {
  it("renders a decorative grid by default and preserves children", () => {
    render(
      <Background data-testid="background">
        <span>Content</span>
      </Background>,
    );

    expect(screen.getByTestId("background")).toHaveClass(
      "puzzle-background",
      "puzzle-background--grid",
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("supports patterns, fades, and custom elements", () => {
    render(
      <Background
        as="section"
        pattern="stripes"
        fade="left"
        data-testid="background"
      />,
    );

    const background = screen.getByTestId("background");
    expect(background.tagName).toBe("SECTION");
    expect(background).toHaveClass("puzzle-background--stripes");
    expect(background).toHaveAttribute("data-fade", "left");
  });

  it("converts numeric values to CSS units and clamps opacity", () => {
    render(
      <Background
        size={32}
        lineWidth={2}
        angle={90}
        patternOpacity={2}
        data-testid="background"
      />,
    );

    expect(screen.getByTestId("background")).toHaveStyle({
      "--_background-size": "32px",
      "--_background-line-width": "2px",
      "--_background-angle": "90deg",
      "--_pattern-opacity": "1",
    });
  });

  it("preserves caller styles, classes, and native attributes", () => {
    render(
      <Background
        className="custom-background"
        style={{ width: "50%" }}
        aria-label="Decorative background"
        data-testid="background"
      />,
    );

    const background = screen.getByTestId("background");
    expect(background).toHaveClass("custom-background");
    expect(background).toHaveAttribute("aria-label", "Decorative background");
    expect(background).toHaveStyle({ width: "50%" });
  });
});
