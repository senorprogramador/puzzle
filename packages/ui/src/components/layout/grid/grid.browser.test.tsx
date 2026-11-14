import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { Grid, GridItem } from "./index";

const rect = (id: string) => screen.getByTestId(id).getBoundingClientRect();

describe("Grid layout", () => {
  it("uses equal tracks, wraps children and honors separate theme gaps", () => {
    const spacing = { "--puzzle-space-2": "10px", "--puzzle-space-8": "30px" };
    render(
      <Grid
        columns={2}
        rowGap="sm"
        columnGap="lg"
        data-testid="grid"
        style={{ width: 400, ...spacing }}
      >
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
        <div data-testid="c">C</div>
      </Grid>,
    );
    expect(rect("a").width).toBeCloseTo(185);
    expect(rect("b").width).toBeCloseTo(185);
    expect(rect("b").left - rect("a").right).toBeCloseTo(30);
    expect(rect("c").top - rect("a").bottom).toBeCloseTo(10);
    expect(rect("c").left).toBe(rect("a").left);
  });

  it("changes columns, gaps, alignment and flow at exact breakpoints", async () => {
    render(
      <Grid
        data-testid="grid"
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap={{ mobile: "0", tablet: "sm", desktop: "lg" }}
        alignH={{ mobile: "start", tablet: "center", desktop: "end" }}
        alignV={{ mobile: "end", desktop: "center" }}
        autoFlow={{ mobile: "row", desktop: "column" }}
      >
        <div>A</div><div>B</div><div>C</div>
      </Grid>,
    );
    for (const [width, count, h, v, flow, gap] of [
      [767, 1, "start", "end", "row", 0],
      [768, 2, "center", "end", "row", 8],
      [1023, 2, "center", "end", "row", 8],
      [1024, 3, "end", "center", "column", 32],
      [1440, 3, "end", "center", "column", 32],
    ] as const) {
      await page.viewport(width, 800);
      const style = getComputedStyle(screen.getByTestId("grid"));
      expect(style.gridTemplateColumns.split(" ")).toHaveLength(count);
      expect(style.justifyItems).toBe(h);
      expect(style.alignItems).toBe(v);
      expect(style.gridAutoFlow).toBe(flow);
      expect(parseFloat(style.columnGap)).toBe(gap);
    }
  });

  it("auto-fits to container width and never forces the minimum wider than it", () => {
    const { rerender } = render(
      <Grid minChildWidth="150px" gap="0" style={{ width: 500 }}>
        <div data-testid="a">A</div><div>B</div><div>C</div>
      </Grid>,
    );
    expect(rect("a").width).toBeCloseTo(500 / 3, 1);
    rerender(
      <Grid minChildWidth="150px" gap="0" style={{ width: 100 }}>
        <div data-testid="a">A</div><div data-testid="b">B</div>
      </Grid>,
    );
    expect(rect("a").width).toBe(100);
    expect(rect("b").top).toBeGreaterThanOrEqual(rect("a").bottom);
  });

  it("supports track templates, numeric rows and native style overrides", () => {
    render(
      <Grid
        columns="2fr 1fr"
        rows={2}
        gap="lg"
        data-testid="grid"
        style={{ width: 300, height: 100, gap: 0 }}
      >
        <div data-testid="a">A</div><div data-testid="b">B</div><div>C</div>
      </Grid>,
    );
    expect(rect("a").width).toBe(200);
    expect(rect("b").width).toBe(100);
    expect(rect("a").height).toBe(50);
    expect(getComputedStyle(screen.getByTestId("grid")).gap).toBe("0px");
  });

  it("keeps long intrinsic content from widening tracks", () => {
    render(
      <Grid columns={2} gap="0" style={{ width: 200 }}>
        <div data-testid="a">{"unbroken".repeat(50)}</div>
        <div data-testid="b">B</div>
      </Grid>,
    );
    expect(rect("a").width).toBe(100);
    expect(rect("b").width).toBe(100);
  });

  it("resolves responsive row spans and column spans including full width", async () => {
    render(
      <Grid columns={4} gap="0" style={{ width: 400, gridAutoRows: "20px" }}>
        <GridItem
          data-testid="item"
          colSpan={{ mobile: 1, tablet: 2, desktop: "full" }}
          rowSpan={{ mobile: 1, tablet: 2 }}
        >Item</GridItem>
      </Grid>,
    );
    for (const [width, itemWidth, itemHeight] of [
      [767, 100, 20], [768, 200, 40], [1023, 200, 40], [1024, 400, 40],
    ] as const) {
      await page.viewport(width, 800);
      expect(rect("item").width).toBe(itemWidth);
      expect(rect("item").height).toBe(itemHeight);
    }
  });

  it("positions items on positive and negative lines without changing DOM order", async () => {
    render(
      <Grid columns={4} rows={2} gap="0" style={{ width: 400, height: 80 }} data-testid="grid">
        <GridItem
          data-testid="a"
          colStart={{ mobile: 2, tablet: -3 }}
          colSpan={2}
          rowStart={2}
        >A</GridItem>
        <GridItem data-testid="b">B</GridItem>
      </Grid>,
    );
    for (const [width, left] of [[767, 100], [768, 200]] as const) {
      await page.viewport(width, 800);
      expect(rect("a").left - rect("grid").left).toBe(left);
      expect(rect("a").top - rect("grid").top).toBe(40);
      expect(rect("a").width).toBe(200);
    }
    expect(screen.getByTestId("grid").firstElementChild).toBe(screen.getByTestId("a"));
  });

  it("applies item alignment and inherits container alignment when auto", async () => {
    render(
      <Grid columns={1} alignH="end" alignV="end" style={{ width: 200, height: 100 }}>
        <GridItem
          data-testid="item"
          alignH={{ mobile: "auto", tablet: "center" }}
          alignV={{ mobile: "auto", tablet: "start" }}
          style={{ width: 20, height: 10 }}
        >A</GridItem>
      </Grid>,
    );
    await page.viewport(767, 800);
    const before = rect("item");
    await page.viewport(768, 800);
    expect(before.left - rect("item").left).toBe(90);
    expect(before.top - rect("item").top).toBe(90);
  });

  it("isolates nested grids from ancestor columns, gaps, and item spans", () => {
    render(
      <Grid columns={4} gap="xl" style={{ width: 400 }}>
        <GridItem colSpan="full">
          <Grid data-testid="nested" gap="0">
            <GridItem data-testid="a">A</GridItem>
            <GridItem data-testid="b">B</GridItem>
          </Grid>
        </GridItem>
      </Grid>,
    );
    const style = getComputedStyle(screen.getByTestId("nested"));
    expect(style.gridTemplateColumns.split(" ")).toHaveLength(1);
    expect(style.gap).toBe("0px");
    expect(rect("a").width).toBe(400);
    expect(rect("b").top).toBeGreaterThanOrEqual(rect("a").bottom);
    expect(getComputedStyle(screen.getByTestId("a")).gridColumnEnd).toBe("span 1");
  });

  it("preserves logical layout in RTL", () => {
    render(
      <Grid columns={2} gap="0" dir="rtl" style={{ width: 200 }}>
        <GridItem data-testid="a">A</GridItem>
        <GridItem data-testid="b">B</GridItem>
      </Grid>,
    );
    expect(rect("a").left).toBeGreaterThan(rect("b").left);
    expect(rect("a").width).toBe(100);
  });
});
