import { fireEvent, render, screen } from "@testing-library/react";
import { createRef, Fragment } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Grid, GridItem, type GridItemProps, type GridProps } from "./index";

describe("Grid", () => {
  it("adds only a root, without wrapping or cloning children", () => {
    const { container, rerender } = render(
      <Grid>
        <Fragment>
          <button key="a">A</button>
          <button key="b">B</button>
        </Fragment>
        {null}
      </Grid>,
    );
    const root = container.firstElementChild!;
    expect(root.tagName).toBe("DIV");
    expect(Array.from(root.children).map((child) => child.tagName)).toEqual([
      "BUTTON", "BUTTON",
    ]);

    rerender(<Grid />);
    expect(root.children).toHaveLength(0);
  });

  it("forwards native props, events, refs and custom classes to a semantic root", () => {
    const ref = createRef<HTMLUListElement>();
    const onClick = vi.fn();
    render(
      <Grid as="ul" ref={ref} aria-label="Results" className="custom" onClick={onClick}>
        <li>Result</li>
      </Grid>,
    );
    const root = screen.getByRole("list", { name: "Results" });
    expect(root).toHaveClass("puzzle-grid", "custom");
    expect(ref.current).toBe(root);
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalledOnce();
    expect(root).not.toHaveAttribute("columns");
    expect(root).not.toHaveAttribute("gap");
  });

  it("uses one equal column, medium gaps and stretching by default", () => {
    const { container } = render(<Grid />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--puzzle-grid-columns-mobile"))
      .toBe("repeat(1, minmax(0, 1fr))");
    expect(root.style.getPropertyValue("--puzzle-grid-row-gap-mobile"))
      .toBe("var(--puzzle-space-4, 1rem)");
    expect(root.style.getPropertyValue("--puzzle-grid-align-h-mobile")).toBe("stretch");
  });

  it("inherits sparse responsive values independently and updates them", () => {
    const { container, rerender } = render(
      <Grid columns={{ mobile: 1, desktop: 4 }} gap={{ mobile: "sm", tablet: "lg" }} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--puzzle-grid-columns-tablet"))
      .toBe("repeat(1, minmax(0, 1fr))");
    expect(root.style.getPropertyValue("--puzzle-grid-columns-desktop"))
      .toBe("repeat(4, minmax(0, 1fr))");
    expect(root.style.getPropertyValue("--puzzle-grid-row-gap-desktop"))
      .toBe("var(--puzzle-space-8, 2rem)");

    rerender(<Grid columns={2} style={{ gap: "3px" }} />);
    expect(root.style.getPropertyValue("--puzzle-grid-columns-desktop"))
      .toBe("repeat(2, minmax(0, 1fr))");
    expect(root.style.gap).toBe("3px");
  });

  it("supports raw track templates and responsive auto-fit widths", () => {
    const { container, rerender } = render(
      <Grid columns="2fr 1fr" rows="auto 1fr" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--puzzle-grid-columns-mobile")).toBe("2fr 1fr");
    expect(root.style.getPropertyValue("--puzzle-grid-rows-mobile")).toBe("auto 1fr");
    rerender(
      <Grid columns={3} minChildWidth={{ mobile: "12rem", desktop: "18rem" }} />,
    );
    expect(root.style.getPropertyValue("--puzzle-grid-columns-desktop"))
      .toBe("repeat(auto-fit, minmax(min(100%, 18rem), 1fr))");
  });

  it.each([0, -1, 1.5, NaN, Infinity])("rejects invalid counts and spans: %s", (value) => {
    expect(() => renderToString(<Grid columns={value} />)).toThrow(RangeError);
    expect(() => renderToString(<Grid rows={{ mobile: 1, desktop: value }} />))
      .toThrow(RangeError);
    expect(() => renderToString(<GridItem colSpan={value} />)).toThrow(RangeError);
    expect(() => renderToString(<GridItem rowSpan={value} />)).toThrow(RangeError);
  });

  it("renders server-side with responsive styles and no layout effects", () => {
    const html = renderToString(
      <Grid as="ul" columns={{ mobile: 1, tablet: 2 }}>
        <GridItem as="li" colSpan="full">Content</GridItem>
      </Grid>,
    );
    expect(html).toContain("<ul");
    expect(html).toContain("<li");
    expect(html).toContain("--puzzle-grid-columns-tablet:repeat(2, minmax(0, 1fr))");
    expect(html.match(/<(ul|li)\b/g)).toHaveLength(2);
  });
});

describe("GridItem", () => {
  it("renders the item itself, supports custom components and forwards refs", () => {
    const Link = (props: React.ComponentPropsWithRef<"a">) => <a {...props} />;
    const ref = createRef<HTMLAnchorElement>();
    render(
      <GridItem as={Link} href="/details" ref={ref} className="custom" colSpan={2}>
        Details
      </GridItem>,
    );
    expect(screen.getByRole("link")).toBe(ref.current);
    expect(ref.current).toHaveClass("puzzle-grid-item", "custom");
    expect(ref.current).toHaveAttribute("href", "/details");
    expect(ref.current).not.toHaveAttribute("colSpan");
    expect(ref.current?.children).toHaveLength(0);
  });

  it("preserves keyed child state across reorders", () => {
    const item = (key: string) => (
      <GridItem key={key}><input aria-label={key} /></GridItem>
    );
    const { rerender } = render(<Grid>{item("a")}{item("b")}</Grid>);
    const input = screen.getByLabelText("a");
    fireEvent.change(input, { target: { value: "kept" } });
    rerender(<Grid>{item("b")}{item("a")}</Grid>);
    expect(screen.getByLabelText("a")).toBe(input);
    expect(input).toHaveValue("kept");
  });

  it.each([0, 1.5, NaN, Infinity])("rejects invalid start lines: %s", (value) => {
    expect(() => renderToString(<GridItem colStart={value} />)).toThrow(RangeError);
    expect(() => renderToString(<GridItem rowStart={value} />)).toThrow(RangeError);
  });

  it("keeps polymorphic props and responsive options type-safe", () => {
    const grid: GridProps<"section"> = { as: "section", columns: { mobile: 1, tablet: 2 } };
    const item: GridItemProps<"a"> = { as: "a", href: "/", colSpan: "full" };
    expect(<Grid {...grid} />).toBeTruthy();
    expect(<GridItem {...item} />).toBeTruthy();
    // @ts-expect-error A div does not accept href.
    <Grid href="/" />;
    // @ts-expect-error Responsive configs require a mobile value.
    <Grid columns={{ tablet: 2 }} />;
    // @ts-expect-error Gap must use the theme spacing scale.
    <Grid gap="huge" />;
    // @ts-expect-error Row spans must be numeric.
    <GridItem rowSpan="full" />;
    // @ts-expect-error Anchor refs must match the selected element.
    <GridItem as="a" ref={createRef<HTMLDivElement>()} />;
  });
});
