import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { BlogSection } from "./blog-section";
import { GallerySection } from "./gallery-section";

it("keeps editorial masonry responsive without causing page overflow", async () => {
  const { container } = render(
    <>
      <BlogSection
        variant="masonry"
        items={Array.from({ length: 6 }, (_, index) => ({
          id: `story-${index}`,
          title: `Story ${index}`,
          image: { src: "", alt: `Editorial photograph ${index}` },
        }))}
      />
      <GallerySection
        variant="masonry"
        items={Array.from({ length: 6 }, (_, index) => ({
          id: `image-${index}`,
          image: { src: "", alt: `Gallery photograph ${index}` },
        }))}
      />
    </>,
  );

  await page.viewport(375, 800);
  const blogItems = container.querySelector(".puzzle-blog-section__items")!;
  const galleryItems = container.querySelector(
    ".puzzle-gallery-section__items",
  )!;
  expect(getComputedStyle(blogItems).columnCount).toBe("1");
  expect(getComputedStyle(galleryItems).columnCount).toBe("1");
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(1280, 800);
  expect(getComputedStyle(blogItems).columnCount).toBe("3");
  expect(getComputedStyle(galleryItems).columnCount).toBe("3");
});
