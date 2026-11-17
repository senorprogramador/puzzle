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
