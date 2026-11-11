import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Stack } from "./index";

afterEach(() => {
  cleanup();
});

const Field = ({ label }: { label: string }) => (
  <input aria-label={label} defaultValue="" />
);

describe("Stack", () => {
  it("renders a div by default and supports `as`", () => {
    const { container, rerender } = render(<Stack>content</Stack>);

    expect(container.firstElementChild?.tagName).toBe("DIV");

    rerender(<Stack as="section">content</Stack>);

    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });

  it("applies direction, gap and alignment classes", () => {
    const { container } = render(
      <Stack direction="row" gap="lg" alignH="between" alignV="center" reverse>
        x
      </Stack>,
    );

    expect(container.firstElementChild).toHaveClass(
      "puzzle-stack",
      "direction-mobile-row",
      "gap-lg",
      "align-h-mobile-between",
      "align-v-mobile-center",
      "reverse",
    );
  });

  it("renders responsive directions per breakpoint", () => {
    const { container } = render(
      <Stack direction={{ mobile: "col", tablet: "row" }}>x</Stack>,
    );

    expect(container.firstElementChild).toHaveClass(
      "direction-mobile-col",
      "direction-tablet-row",
    );
  });

  it("places dividers between children only", () => {
    const { container } = render(
      <Stack divider={<hr />}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Stack>,
    );

    const kinds = Array.from(container.firstElementChild!.children).map(
      (node) => node.tagName,
    );

    expect(kinds).toEqual(["SPAN", "HR", "SPAN", "HR", "SPAN"]);
  });

  it("wraps non-element dividers so every divider has a key", () => {
    render(
      <Stack divider="•">
        <span>A</span>
        <span>B</span>
      </Stack>,
    );

    expect(screen.getByText("•")).toBeTruthy();
  });

  it("keeps child state when keyed children are reordered", () => {
    const { rerender } = render(
      <Stack divider={<hr />}>
        <Field key="a" label="A" />
        <Field key="b" label="B" />
      </Stack>,
    );

    const inputA = screen.getByLabelText("A") as HTMLInputElement;
    inputA.value = "typed";

    rerender(
      <Stack divider={<hr />}>
        <Field key="b" label="B" />
        <Field key="a" label="A" />
      </Stack>,
    );

    // The same DOM node (and its uncontrolled value) survives the reorder.
    expect(screen.getByLabelText("A")).toBe(inputA);
    expect(inputA.value).toBe("typed");
  });

  it("does not add dividers for a single child", () => {
    const { container } = render(
      <Stack divider={<hr />}>
        <span>Only</span>
      </Stack>,
    );

    expect(container.querySelector("hr")).toBeNull();
  });
});
