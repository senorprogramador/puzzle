import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Container } from "./index";

afterEach(cleanup);

describe("Container", () => {
  it("renders a div by default", () => {
    const { container } = render(<Container>Content</Container>);

    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("supports a custom element", () => {
    const { container } = render(<Container as="main">Content</Container>);

    expect(container.firstElementChild?.tagName).toBe("MAIN");
  });

  it("uses the container preset by default", () => {
    const { container } = render(<Container>Content</Container>);

    expect(container.firstElementChild).toHaveClass(
      "puzzle-container",
      "puzzle-container--container",
    );
  });

  it.each(["container", "content", "prose", "full"] as const)(
    "supports the %s width preset",
    (widthPreset) => {
      const { container } = render(
        <Container widthPreset={widthPreset}>Content</Container>,
      );

      expect(container.firstElementChild).toHaveClass(
        `puzzle-container--${widthPreset}`,
      );
    },
  );

  it("preserves custom classes and DOM props", () => {
    const { container } = render(
      <Container
        className="custom-container"
        data-testid="container"
        aria-label="Main content"
      >
        Content
      </Container>,
    );

    expect(container.firstElementChild).toHaveClass("custom-container");
    expect(container.firstElementChild).toHaveAttribute(
      "aria-label",
      "Main content",
    );
    expect(container.firstElementChild).toHaveAttribute(
      "data-testid",
      "container",
    );
  });
});
