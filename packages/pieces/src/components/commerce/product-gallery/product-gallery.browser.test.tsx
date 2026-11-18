import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { ProductGallerySection } from "./product-gallery";

it("keeps the image rail scrollable inside the page at mobile widths", async () => {
  const { container } = render(
    <ProductGallerySection
      variant="horizontal"
      images={Array.from({ length: 5 }, (_, index) => ({
        id: `image-${index}`,
        src: "",
        alt: `Product view ${index + 1}`,
      }))}
    />,
  );
  const rail = container.querySelector(
    ".puzzle-product-gallery__thumbnails",
  )!;

  await page.viewport(375, 800);
  expect(rail.scrollWidth).toBeGreaterThan(rail.clientWidth);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(1280, 800);
  expect(rail.getBoundingClientRect().width).toBeGreaterThan(0);
});

it("stacks the vertical thumbnail rail on mobile and moves it beside the image on desktop", async () => {
  const { container } = render(
    <ProductGallerySection
      variant="vertical"
      images={Array.from({ length: 4 }, (_, index) => ({
        id: `image-${index}`,
        src: "",
        alt: `Product view ${index + 1}`,
      }))}
    />,
  );
  const layout = container.querySelector(".puzzle-product-gallery__layout")!;
  const thumbnails = container.querySelector(
    ".puzzle-product-gallery__thumbnails",
  )!;

  await page.viewport(320, 800);
  expect(getComputedStyle(layout).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(1);
  expect(
    getComputedStyle(thumbnails).gridTemplateColumns.trim().split(/\s+/),
  ).toHaveLength(2);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(1280, 800);
  expect(getComputedStyle(layout).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(2);
  expect(
    getComputedStyle(thumbnails).gridTemplateColumns.trim().split(/\s+/),
  ).toHaveLength(1);
});
