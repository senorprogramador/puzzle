import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { page, userEvent as browserUserEvent } from "vitest/browser";
import { GallerySection } from "./gallery-section";

const images = Array.from({ length: 4 }, (_, index) => ({
  id: `image-${index}`,
  image: {
    src: "",
    alt: `Gallery image ${index + 1}`,
    width: 1200,
    height: 800,
  },
  featured: index === 0,
}));

it("keeps featured layouts within narrow viewports", async () => {
  const { container } = render(
    <GallerySection variant="featured" items={images} />,
  );
  const list = container.querySelector<HTMLUListElement>(
    ".puzzle-gallery-section__items",
  )!;
  const featuredItem = list.querySelector("li")!;

  await page.viewport(320, 800);
  expect(featuredItem.getBoundingClientRect().right).toBeLessThanOrEqual(
    list.getBoundingClientRect().right + 1,
  );
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(1280, 800);
  expect(featuredItem.getBoundingClientRect().width).toBeGreaterThan(
    list.querySelectorAll("li")[1]!.getBoundingClientRect().width,
  );
});

it("gives every horizontal rail item a consistent scroll-snap width", async () => {
  const { container } = render(
    <GallerySection variant="horizontal" items={images} />,
  );
  const list = container.querySelector<HTMLUListElement>(
    ".puzzle-gallery-section__items",
  )!;
  const items = list.querySelectorAll("li");

  await page.viewport(375, 800);
  expect(items[0]!.getBoundingClientRect().width).toBeCloseTo(
    items[1]!.getBoundingClientRect().width,
    0,
  );
  expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
  await browserUserEvent.keyboard("{Tab}");
  expect(list).toHaveFocus();
  expect(getComputedStyle(list).outlineStyle).toBe("solid");
  await browserUserEvent.keyboard("{ArrowRight}");
  await waitFor(() => expect(list.scrollLeft).toBeGreaterThan(0));
});

it("supports real-browser lightbox navigation and restores trigger focus", async () => {
  const user = userEvent.setup();
  render(<GallerySection variant="grid" items={images} lightbox />);
  const trigger = screen.getByRole("button", {
    name: "Open Gallery image 1 in lightbox",
  });

  await user.click(trigger);
  const dialog = await screen.findByRole("dialog");
  await waitFor(() => expect(dialog).toBeVisible());
  await user.keyboard("{ArrowRight}");
  expect(
    await screen.findByRole("img", {
      name: "Gallery image 2 image unavailable",
    }),
  ).toBeVisible();
  await user.keyboard("{Escape}");

  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(trigger).toHaveFocus());
});
