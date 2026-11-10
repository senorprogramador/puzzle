import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AspectRatio } from "./index";

describe("AspectRatio", () => {
  it("renders children", () => {
    render(
      <AspectRatio>
        <span>Content</span>
      </AspectRatio>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("defaults to a square aspect ratio", () => {
    render(<AspectRatio data-testid="aspect-ratio">Content</AspectRatio>);

    expect(screen.getByTestId("aspect-ratio")).toHaveStyle({
      aspectRatio: "1",
    });
  });

  it("supports custom aspect ratios", () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="aspect-ratio">
        Content
      </AspectRatio>,
    );

    expect(screen.getByTestId("aspect-ratio")).toHaveStyle({
      aspectRatio: "1.7777777777777777",
    });
  });

  it("supports custom HTML elements", () => {
    render(
      <AspectRatio as="section" data-testid="aspect-ratio">
        Content
      </AspectRatio>,
    );

    expect(screen.getByTestId("aspect-ratio").tagName).toBe("SECTION");
  });

  it("forwards native HTML attributes", () => {
    render(
      <AspectRatio
        as="section"
        id="media-container"
        aria-label="Media container"
        data-testid="aspect-ratio"
      >
        Content
      </AspectRatio>,
    );

    const element = screen.getByTestId("aspect-ratio");

    expect(element).toHaveAttribute("id", "media-container");
    expect(element).toHaveAttribute("aria-label", "Media container");
  });

  it("merges custom classes", () => {
    render(
      <AspectRatio className="custom-class" data-testid="aspect-ratio">
        Content
      </AspectRatio>,
    );

    expect(screen.getByTestId("aspect-ratio")).toHaveClass(
      "puzzle-aspect-ratio",
      "custom-class",
    );
  });

  it("preserves custom styles", () => {
    render(
      <AspectRatio
        ratio={4 / 3}
        style={{ width: "50%", maxWidth: "400px" }}
        data-testid="aspect-ratio"
      >
        Content
      </AspectRatio>,
    );

    expect(screen.getByTestId("aspect-ratio")).toHaveStyle({
      width: "50%",
      maxWidth: "400px",
      aspectRatio: "1.3333333333333333",
    });
  });

  it("rejects invalid aspect ratios", () => {
    expect(() => render(<AspectRatio ratio={0}>Content</AspectRatio>)).toThrow(
      RangeError,
    );
  });
});
