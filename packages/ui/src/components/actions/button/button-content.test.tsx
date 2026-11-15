import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ButtonContent } from "./button-content";

describe("ButtonContent", () => {
  it("renders the leading, content and trailing slots in order", () => {
    const { container } = render(
      <ButtonContent loading={false} leading="Before" trailing="After">
        Action
      </ButtonContent>,
    );

    expect([...container.children].map((element) => element.className)).toEqual([
      "puzzle-button__leading",
      "puzzle-button__content",
      "puzzle-button__trailing",
    ]);
    expect(container.textContent).toBe("BeforeActionAfter");
  });

  it("omits absent slots without dropping numeric content", () => {
    const { container } = render(<ButtonContent loading={false}>{0}</ButtonContent>);

    expect(screen.getByText("0")).toHaveClass("puzzle-button__content");
    expect(container.children).toHaveLength(1);
  });

  it("renders no empty content wrapper when no content is provided", () => {
    const { container } = render(<ButtonContent loading={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("replaces only the leading slot while loading and restores it afterwards", () => {
    const { container, rerender } = render(
      <ButtonContent loading leading="Before" trailing="After">Save</ButtonContent>,
    );

    expect(screen.queryByText("Before")).not.toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
    expect(container.querySelector(".puzzle-button__spinner")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".puzzle-button__spinner svg")).toBeInTheDocument();

    rerender(
      <ButtonContent loading={false} leading="Before" trailing="After">Save</ButtonContent>,
    );

    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(container.querySelector(".puzzle-button__spinner")).not.toBeInTheDocument();
  });
});
