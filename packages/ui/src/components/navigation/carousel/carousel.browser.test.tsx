import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CarouselController } from "./controller";
import { Carousel } from "./index";
import { page } from "vitest/browser";

afterEach(() => {
  cleanup();
});

const renderItems = (items: string[]) => (
  <CarouselController<string> items={items}>
    <Carousel<string>
      getItemKey={(item) => item}
      itemWidth="100px"
      gap={10}
      viewportStyle={{ width: 230 }}
      renderItem={(item) => <div data-testid={item}>{item}</div>}
    />
  </CarouselController>
);

const leftOf = (id: string) =>
  screen.getByTestId(id).getBoundingClientRect().left;

describe("Carousel (browser)", () => {
  for (const responsive of [false, true]) {
    it(`remeasures offsets and pagination when a ${responsive ? "responsive" : "scalar"} gap changes without resizing panels`, async () => {
      await page.viewport(1100, 800);
      const carousel = (gap: number) => (
        <CarouselController items={["A", "B", "C", "D", "E"]} currentPanel={1}>
          <Carousel<string>
            itemWidth="100px"
            gap={responsive ? { mobile: 5, tablet: 10, desktop: gap } : gap}
            viewportStyle={{ width: 230 }}
            renderItem={(item) => <div data-testid={item}>{item}</div>}
            renderPager={(_, total) => <span data-testid="pages">{total}</span>}
          />
        </CarouselController>
      );
      const { rerender } = render(carousel(10));
      const viewport = screen.getByRole("group", { name: "Carousel" });

      await expect.poll(() => leftOf("B") - viewport.getBoundingClientRect().left).toBeCloseTo(0, 0);
      expect(screen.getByTestId("pages")).toHaveTextContent("3");

      rerender(carousel(40));

      await expect.poll(() => leftOf("B") - viewport.getBoundingClientRect().left).toBeCloseTo(0, 0);
      expect(leftOf("C") - leftOf("B")).toBeCloseTo(140, 0);
      expect(screen.getByTestId("pages")).toHaveTextContent("5");

      rerender(carousel(10));
      await expect.poll(() => leftOf("B") - viewport.getBoundingClientRect().left).toBeCloseTo(0, 0);
      expect(screen.getByTestId("pages")).toHaveTextContent("3");
    });
  }

  it("lays slides out in item order using real measurements", () => {
    render(renderItems(["A", "B", "C", "D"]));

    expect(leftOf("B") - leftOf("A")).toBeCloseTo(110, 0);
    expect(leftOf("C") - leftOf("B")).toBeCloseTo(110, 0);
  });

  it("follows a reorder and keeps the same DOM nodes", async () => {
    const { rerender } = render(renderItems(["A", "B", "C", "D"]));
    const nodeA = screen.getByTestId("A");

    rerender(renderItems(["D", "C", "B", "A"]));

    expect(screen.getByTestId("A")).toBe(nodeA);
    expect(leftOf("D")).toBeLessThan(leftOf("C"));
    expect(leftOf("C")).toBeLessThan(leftOf("A"));
  });

  it("keeps the first slide at the start of the viewport after reordering", async () => {
    const { rerender } = render(renderItems(["A", "B", "C", "D"]));
    const viewport = screen.getByRole("group", { name: "Carousel" });

    rerender(renderItems(["C", "A", "B", "D"]));

    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(leftOf("C")).toBeCloseTo(viewport.getBoundingClientRect().left, 0);
  });
});
