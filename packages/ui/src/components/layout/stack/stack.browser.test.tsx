import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Stack } from "./index";

afterEach(() => {
  cleanup();
});

const box = (label: string) => (
  <div data-testid={label} style={{ width: 40, height: 20 }}>
    {label}
  </div>
);

describe("Stack (browser)", () => {
  it("lays children out in a column by default", () => {
    render(
      <Stack>
        {box("a")}
        {box("b")}
      </Stack>,
    );

    const a = screen.getByTestId("a").getBoundingClientRect();
    const b = screen.getByTestId("b").getBoundingClientRect();

    expect(b.top).toBeGreaterThanOrEqual(a.bottom);
    expect(b.left).toBe(a.left);
  });

  it("lays children out in a row with a gap", () => {
    render(
      <Stack direction="row" gap="xl">
        {box("a")}
        {box("b")}
      </Stack>,
    );

    const a = screen.getByTestId("a").getBoundingClientRect();
    const b = screen.getByTestId("b").getBoundingClientRect();

    expect(b.left - a.right).toBeGreaterThan(0);
    expect(b.top).toBe(a.top);
  });

  it("applies a larger gap for larger sizes", () => {
    const gapOf = (gap: "xs" | "xl") => {
      const { unmount } = render(
        <Stack direction="row" gap={gap}>
          {box("a")}
          {box("b")}
        </Stack>,
      );
      const value =
        screen.getByTestId("b").getBoundingClientRect().left -
        screen.getByTestId("a").getBoundingClientRect().right;

      unmount();
      return value;
    };

    expect(gapOf("xl")).toBeGreaterThan(gapOf("xs"));
  });

  it("places dividers between children only", () => {
    render(
      <Stack direction="row" gap="0" divider={<i data-testid="divider" />}>
        {box("a")}
        {box("b")}
        {box("c")}
      </Stack>,
    );

    const dividers = screen.getAllByTestId("divider");

    expect(dividers).toHaveLength(2);
    expect(
      screen.getByTestId("a").compareDocumentPosition(dividers[0]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      dividers[1].compareDocumentPosition(screen.getByTestId("c")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("reverses the visual order", () => {
    render(
      <Stack direction="row" reverse>
        {box("a")}
        {box("b")}
      </Stack>,
    );

    expect(
      screen.getByTestId("a").getBoundingClientRect().left,
    ).toBeGreaterThan(screen.getByTestId("b").getBoundingClientRect().left);
  });
});
