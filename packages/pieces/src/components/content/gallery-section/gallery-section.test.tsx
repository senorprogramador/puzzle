import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { GallerySection } from "./gallery-section";
import type {
  GalleryItem,
  GallerySectionVariant,
} from "./gallery-section.types";

const variants: GallerySectionVariant[] = [
  "grid",
  "masonry",
  "justified",
  "bento",
  "featured",
  "carousel",
  "collage",
  "editorial",
  "fullscreen",
  "thumbnails",
  "horizontal",
  "vertical",
  "asymmetric",
  "mixed",
  "portfolio",
];

const images: GalleryItem[] = [
  {
    id: "morning",
    image: {
      src: "",
      alt: "Morning light across a quiet reading room",
      width: 1200,
      height: 800,
    },
    caption: "Morning, before the house wakes",
    href: "/journal/morning",
    featured: true,
  },
  {
    id: "table",
    image: {
      src: "/images/shared-table.jpg",
      alt: "A long table prepared for a shared meal",
      width: 1200,
      height: 900,
    },
    caption: "A place for everyone",
  },
];

afterEach(cleanup);

describe("GallerySection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <GallerySection variant={variant} items={images} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("Morning, before the house wakes")).toBeVisible();
  });

  it("opens the lightbox and supports arrow-key and Escape navigation", async () => {
    const user = userEvent.setup();
    render(<GallerySection variant="grid" items={images} lightbox />);

    await user.click(
      screen.getByRole("button", {
        name: "Open Morning light across a quiet reading room in lightbox",
      }),
    );
    expect(
      await screen.findByRole("dialog", {
        name: "Morning light across a quiet reading room",
      }),
    ).toBeVisible();

    await user.keyboard("{ArrowRight}");
    expect(
      screen.getByRole("img", {
        name: "A long table prepared for a shared meal",
      }),
    ).toBeVisible();
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("handles missing images, links, empty lists, and large collections", () => {
    const { container, rerender } = render(
      <GallerySection items={[images[0]!]} />,
    );
    expect(
      screen.getByRole("img", {
        name: "Morning light across a quiet reading room image unavailable",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Morning light across a quiet reading room",
      }),
    ).toHaveAttribute("href", "/journal/morning");

    rerender(<GallerySection items={[]} />);
    expect(container.querySelector(".puzzle-gallery-section__items")).toBeNull();

    const manyImages = Array.from({ length: 60 }, (_, index) => ({
      id: `image-${index}`,
      image: { src: "", alt: `Editorial image ${index}` },
    }));
    rerender(<GallerySection variant="masonry" items={manyImages} />);
    expect(
      container.querySelectorAll(".puzzle-gallery-section__items > li"),
    ).toHaveLength(60);
  });
});
