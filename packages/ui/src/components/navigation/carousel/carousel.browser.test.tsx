import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CarouselController } from "./controller";
import { Carousel } from "./index";

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
