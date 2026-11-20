import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { Image } from "./index";

afterEach(cleanup);

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

describe("Image layout stability", () => {
  it.each([390, 1280])(
    "reserves responsive dimensions through fallback without measurable CLS at %ipx",
    async (viewportWidth) => {
      await page.viewport(viewportWidth, 800);
      await nextFrame();

      const { container } = render(
        <main style={{ width: "100vw" }}>
          <Image
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3C/svg%3E"
            alt="Responsive product"
            width={800}
            height={400}
            fallback={<span>Image unavailable</span>}
          />
          <div data-layout-anchor style={{ height: 1 }} />
        </main>,
      );
      await nextFrame();

      const image = container.querySelector("img")!;
      const imageContainer = container.querySelector<HTMLElement>(".puzzle-image")!;
      const anchor = container.querySelector<HTMLElement>("[data-layout-anchor]")!;
      const before = anchor.getBoundingClientRect().top;
      const widthBefore = imageContainer.getBoundingClientRect().width;
      const heightBefore = imageContainer.getBoundingClientRect().height;

      expect(widthBefore).toBeCloseTo(Math.min(viewportWidth, 800), 0);
      expect(heightBefore).toBeCloseTo(widthBefore / 2, 0);

      let cls = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<
          PerformanceEntry & { value: number; hadRecentInput: boolean }
        >) {
          if (!entry.hadRecentInput) cls += entry.value;
        }
      });
      observer.observe({ type: "layout-shift", buffered: false });

      fireEvent.error(image);
      await nextFrame();
      await nextFrame();

      const after = anchor.getBoundingClientRect().top;
      const layoutShifts = observer.takeRecords() as Array<
        PerformanceEntry & { value: number; hadRecentInput: boolean }
      >;
      cls += layoutShifts.reduce(
        (total, entry) => total + (entry.hadRecentInput ? 0 : entry.value),
        0,
      );
      observer.disconnect();

      expect(anchor.getBoundingClientRect().top).toBeCloseTo(before, 0);
      expect(imageContainer.getBoundingClientRect().width).toBeCloseTo(
        widthBefore,
        0,
      );
      expect(imageContainer.getBoundingClientRect().height).toBeCloseTo(
        heightBefore,
        0,
      );
      expect(after).toBeCloseTo(before, 0);
      expect(cls).toBeLessThanOrEqual(0.01);
    },
  );
});
