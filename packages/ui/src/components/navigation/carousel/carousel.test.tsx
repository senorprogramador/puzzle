import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Carousel } from "./index";
import { CarouselController } from "./controller";
import type { ReactNode } from "react";

const items = ["One", "Two", "Three", "Four", "Five"];

const renderCarousel = (
  props: Partial<React.ComponentProps<typeof Carousel<string>>> = {},
  controllerProps: Partial<
    React.ComponentProps<typeof CarouselController<string>>
  > = {},
) => {
  const onPanelChange = vi.fn();

  const result = render(
    <CarouselController
      items={items}
      onPanelChange={onPanelChange}
      {...controllerProps}
    >
      <Carousel
        renderItem={(item) => <div>{item}</div>}
        panelsPerView={2}
        backButton={<button type="button">Previous</button>}
        nextButton={<button type="button">Next</button>}
        {...props}
      />
    </CarouselController>,
  );

  return { ...result, onPanelChange };
};

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );

  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16),
  );

  vi.stubGlobal("cancelAnimationFrame", (id: number) =>
    window.clearTimeout(id),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Carousel", () => {
  it("renders all supplied items", () => {
    renderCarousel();

    for (const item of items) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("renders a labelled carousel viewport", () => {
    renderCarousel({
      ariaLabel: "Featured products",
    });

    expect(
      screen.getByRole("group", { name: "Featured products" }),
    ).toBeInTheDocument();
  });

  it("renders the supplied navigation controls", () => {
    renderCarousel();

    expect(
      screen.getByRole("button", { name: "Previous" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("starts at the configured default panel", () => {
    renderCarousel(
      {},
      {
        defaultPanel: 2,
      },
    );

    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("supports a controlled currentPanel", () => {
    renderCarousel(
      {},
      {
        currentPanel: 2,
      },
    );

    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("does not throw when no navigation controls are supplied", () => {
    expect(() =>
      renderCarousel({
        backButton: undefined,
        nextButton: undefined,
      }),
    ).not.toThrow();
  });

  it("supports custom pager rendering", () => {
    // jsdom performs no layout, so supply item and viewport geometry.
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: Element) {
        const siblings = Array.from(this.parentElement?.children ?? []);
        const isItem = this.classList.contains("puzzle-carousel__item");
        const left = isItem ? siblings.indexOf(this) * 100 : 0;
        const width = this.classList.contains("puzzle-carousel__viewport")
          ? 200
          : isItem
            ? 100
            : 500;

        return {
          x: left,
          y: 0,
          top: 0,
          left,
          right: left + width,
          bottom: 20,
          width,
          height: 20,
          toJSON: () => ({}),
        } as DOMRect;
      },
    );

    renderCarousel({
      renderPager: (currentPage, numberOfPages) => (
        <span>
          Page {currentPage + 1} of {numberOfPages}
        </span>
      ),
    });

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("does not allow the previous button to navigate before the first page", async () => {
    const user = userEvent.setup();
    const { onPanelChange } = renderCarousel();

    const previous = screen.getByRole("button", { name: "Previous" });

    expect(previous).toBeDisabled();

    await user.click(previous);

    expect(onPanelChange).not.toHaveBeenCalled();
  });

  it("uses the configured accessible label", () => {
    renderCarousel({
      ariaLabel: "Image gallery",
    });

    expect(
      screen.getByRole("group", { name: "Image gallery" }),
    ).toBeInTheDocument();
  });

  it("supports an empty item collection", () => {
    render(
      <CarouselController items={[]}>
        <Carousel renderItem={(item) => <div>{item as ReactNode}</div>} />
      </CarouselController>,
    );

    expect(screen.getByRole("group", { name: "Carousel" })).toBeInTheDocument();
  });

  it("keeps navigation controls disabled when there is only one page", () => {
    render(
      <CarouselController items={["Only item"]}>
        <Carousel
          renderItem={(item) => <div>{item as ReactNode}</div>}
          panelsPerView={2}
          backButton={<button type="button">Previous</button>}
          nextButton={<button type="button">Next</button>}
        />
      </CarouselController>,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
