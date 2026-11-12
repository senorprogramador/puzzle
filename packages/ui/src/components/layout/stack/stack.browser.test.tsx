import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Stack } from "./index";
import { page } from "vitest/browser";

afterEach(() => {
  cleanup();
});

// Chromium may serialize flex-start/end as flow-start/end.
const normalizeAlignment = (value: string) => value.replace("flow-", "flex-");

for (const direction of ["row", "col"] as const) {
  it(`updates responsive alignment independently of a fixed ${direction} direction`, async () => {
    render(
      <Stack
        data-testid="stack"
        direction={direction}
        alignH={{ mobile: "start", tablet: "center", desktop: "end" }}
        alignV={{ mobile: "end", tablet: "start", desktop: "center" }}
      />,
    );

    for (const [width, horizontal, vertical] of [
      [767, "flex-start", "flex-end"],
      [768, "center", "flex-start"],
      [1023, "center", "flex-start"],
      [1024, "flex-end", "center"],
      [1440, "flex-end", "center"],
    ] as const) {
      await page.viewport(width, 800);
      const style = getComputedStyle(screen.getByTestId("stack"));
      expect(normalizeAlignment(style.justifyContent)).toBe(direction === "row" ? horizontal : vertical);
      expect(normalizeAlignment(style.alignItems)).toBe(direction === "row" ? vertical : horizontal);
    }
  });
}

it("remaps alignment when direction changes and alignment values are inherited", async () => {
  render(
    <Stack
      data-testid="stack"
      direction={{ mobile: "col", tablet: "row", desktop: "col" }}
      alignH={{ mobile: "end", tablet: "center" }}
      alignV="start"
      reverse
    />,
  );

  for (const [width, direction, main, cross] of [
    [375, "column-reverse", "flex-start", "flex-end"],
    [768, "row-reverse", "center", "flex-start"],
    [1024, "column-reverse", "flex-start", "center"],
  ] as const) {
    await page.viewport(width, 800);
    const style = getComputedStyle(screen.getByTestId("stack"));
    expect(style.flexDirection).toBe(direction);
    expect(normalizeAlignment(style.justifyContent)).toBe(main);
    expect(normalizeAlignment(style.alignItems)).toBe(cross);
  }
});

const box = (label: string) => (
  <div data-testid={label} style={{ width: 40, height: 20 }}>
    {label}
  </div>
);

describe("Stack (browser)", () => {
  for (const direction of ["col", "row"] as const) {
    it(`supports main-axis distribution and cross-axis stretching in a ${direction}`, () => {
      render(
        <Stack
          data-testid="stack"
          direction={direction}
          alignH={direction === "row" ? "between" : "stretch"}
          alignV={direction === "row" ? "stretch" : "between"}
        />,
      );
      const style = getComputedStyle(screen.getByTestId("stack"));
      expect(style.justifyContent).toBe("space-between");
      expect(style.alignItems).toBe("stretch");
    });
  }

  it("spaces row items horizontally and centers them vertically", () => {
    render(
      <Stack direction="row" alignH="between" alignV="center" data-testid="stack">
        {box("a")}
        {box("b")}
      </Stack>,
    );
    const style = getComputedStyle(screen.getByTestId("stack"));
    expect(style.justifyContent).toBe("space-between");
    expect(style.alignItems).toBe("center");
  });

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
      screen.getByTestId("a").compareDocumentPosition(dividers[0]!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      dividers[1]!.compareDocumentPosition(screen.getByTestId("c")) &
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
