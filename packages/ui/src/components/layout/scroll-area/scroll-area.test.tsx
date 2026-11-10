import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScrollArea } from "./index";

afterEach(cleanup);

describe("ScrollArea", () => {
  it("renders a focusable div with vertical scrolling by default", () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);
    const element = container.firstElementChild;

    expect(element?.tagName).toBe("DIV");
    expect(element).toHaveClass("puzzle-scroll-area");
    expect(element).toHaveAttribute("data-orientation", "vertical");
    expect(element).toHaveAttribute("tabindex", "0");
    expect(element).toHaveStyle({
      overflowX: "hidden",
      overflowY: "auto",
    });
  });

  it("supports horizontal and two-axis scrolling", () => {
    const { rerender, container } = render(
      <ScrollArea orientation="horizontal">Content</ScrollArea>,
    );

    expect(container.firstElementChild).toHaveStyle({
      overflowX: "auto",
      overflowY: "hidden",
    });

    rerender(<ScrollArea orientation="both">Content</ScrollArea>);

    expect(container.firstElementChild).toHaveStyle({
      overflowX: "auto",
      overflowY: "auto",
    });
  });

  it("uses a region role when an accessible name is provided", () => {
    const { getByRole } = render(
      <ScrollArea aria-label="Activity history">Content</ScrollArea>,
    );

    expect(
      getByRole("region", { name: "Activity history" }),
    ).toBeInTheDocument();
  });

  it("does not add a region role without an accessible name", () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);

    expect(container.firstElementChild).not.toHaveAttribute("role");
  });

  it("allows an explicit role and tab index", () => {
    const { getByRole } = render(
      <ScrollArea role="group" tabIndex={-1}>
        Content
      </ScrollArea>,
    );

    expect(getByRole("group")).toHaveAttribute("tabindex", "-1");
  });

  it("forwards native attributes and merges custom classes", () => {
    const { getByTitle } = render(
      <ScrollArea
        className="custom-scroll-area"
        title="Scrollable content"
        data-testid="scroll-area"
      >
        Content
      </ScrollArea>,
    );

    expect(getByTitle("Scrollable content")).toHaveClass(
      "puzzle-scroll-area",
      "custom-scroll-area",
    );
  });

  it("forwards refs", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(<ScrollArea ref={ref}>Content</ScrollArea>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("puzzle-scroll-area");
  });

  it("allows caller styles to override defaults", () => {
    const { container } = render(
      <ScrollArea style={{ overflowY: "scroll" }}>Content</ScrollArea>,
    );

    expect(container.firstElementChild).toHaveStyle({
      overflowY: "scroll",
    });
  });
});
