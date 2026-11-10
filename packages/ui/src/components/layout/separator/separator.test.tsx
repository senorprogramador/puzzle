import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Separator } from "./index";

afterEach(() => {
  cleanup();
});

describe("Separator", () => {
  it("renders a div by default", () => {
    const { container } = render(<Separator />);

    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("uses horizontal orientation by default", () => {
    const { container } = render(<Separator />);

    expect(container.firstElementChild).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("uses decorative semantics by default", () => {
    const { container } = render(<Separator />);

    expect(container.firstElementChild).toHaveAttribute("role", "none");
  });

  it("supports vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);

    expect(container.firstElementChild).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("supports semantic horizontal separators", () => {
    const { container } = render(<Separator decorative={false} />);

    expect(container.firstElementChild).toHaveAttribute("role", "separator");

    expect(container.firstElementChild).not.toHaveAttribute("aria-orientation");
  });

  it("supports semantic vertical separators", () => {
    const { container } = render(
      <Separator orientation="vertical" decorative={false} />,
    );

    expect(container.firstElementChild).toHaveAttribute("role", "separator");

    expect(container.firstElementChild).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  it("applies the component class", () => {
    const { container } = render(<Separator />);

    expect(container.firstElementChild).toHaveClass("puzzle-separator");
  });

  it("supports custom class names", () => {
    const { container } = render(<Separator className="custom-separator" />);

    expect(container.firstElementChild).toHaveClass(
      "puzzle-separator",
      "custom-separator",
    );
  });

  it("forwards HTML attributes", () => {
    const { container } = render(
      <Separator id="section-divider" title="Section divider" />,
    );

    expect(container.firstElementChild).toHaveAttribute(
      "id",
      "section-divider",
    );

    expect(container.firstElementChild).toHaveAttribute(
      "title",
      "Section divider",
    );
  });

  it("forwards data attributes", () => {
    const { container } = render(<Separator data-testid="custom-divider" />);

    expect(container.firstElementChild).toHaveAttribute(
      "data-testid",
      "custom-divider",
    );
  });

  it("forwards refs", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(<Separator ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("puzzle-separator");
  });
});
