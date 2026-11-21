import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ProductGallerySection } from "./product-gallery";
import type {
  ProductGalleryImage,
  ProductGalleryVariant,
} from "./product-gallery.types";

const variants: ProductGalleryVariant[] = [
  "grid",
  "masonry",
  "featured",
  "carousel",
  "thumbnails",
  "split",
  "editorial",
  "fullscreen",
  "stacked",
  "collage",
  "horizontal",
  "vertical",
];

const images: ProductGalleryImage[] = [
  {
    id: "front",
    src: "/lamp-front.png",
    alt: "Pendant lamp viewed from the front",
    caption: "Front view",
  },
  {
    id: "side",
    src: "/lamp-side.png",
    alt: "Pendant lamp viewed from the side",
    caption: "Side view",
  },
  {
    id: "detail",
    src: "/lamp-detail.png",
    alt: "Close-up of the lamp's linen shade",
    caption: "Linen shade detail",
  },
];

afterEach(cleanup);

describe("ProductGallerySection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <ProductGallerySection variant={variant} images={images} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(
      container.querySelectorAll(".puzzle-product-gallery__thumbnails > li"),
    ).toHaveLength(
      variant === "thumbnails" || variant === "fullscreen" || variant === "carousel"
        ? 0
        : 3,
    );
  });

  it("uses accessible thumbnail tabs with arrow-key selection", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ProductGallerySection variant="thumbnails" images={images} />,
    );

    const firstTab = screen.getByRole("tab", {
      name: "Pendant lamp viewed from the front",
    });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(
      screen.getByRole("tab", {
        name: "Pendant lamp viewed from the side",
      }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      container.querySelector(".puzzle-product-gallery__main img"),
    ).toHaveAttribute("alt", "Pendant lamp viewed from the side");
  });

  it("uses the UI carousel with consistent controls and optional zoom", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ProductGallerySection variant="carousel" images={images} zoom />,
    );
    const gallery = screen.getByRole("group", {
      name: "Product images. Use the left and right arrow keys to navigate.",
    });

    expect(
      container.querySelectorAll(".puzzle-carousel__item"),
    ).toHaveLength(images.length);
    expect(
      screen.getByRole("button", { name: "Previous image" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Next image" })).toBeVisible();
    expect(gallery).toHaveAttribute("tabindex", "0");
    const zoom = screen.getAllByRole("button", { name: "Zoom image" })[0]!;
    await user.click(zoom);
    expect(screen.getAllByRole("button", { name: "Reset image zoom" })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Reset image zoom" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("opens an accessible lightbox and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallerySection variant="fullscreen" images={images} />,
    );

    await user.click(
      screen.getByRole("button", { name: "Open Pendant lamp viewed from the front in lightbox" }),
    );
    expect(
      await screen.findByRole("dialog", { name: "Front view" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Close product image" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Previous image" })).toBeDisabled();
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("handles absent images and empty or large galleries", () => {
    const { container, rerender } = render(
      <ProductGallerySection
        images={[
          {
            id: "missing",
            src: "",
            alt: "Missing product photo",
          },
        ]}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Missing product photo image unavailable" }),
    ).toBeVisible();

    rerender(<ProductGallerySection images={[]} />);
    expect(container.querySelector(".puzzle-product-gallery__layout")).toBeNull();

    const manyImages = Array.from({ length: 40 }, (_, index) => ({
      id: `image-${index}`,
      src: `/image-${index}.jpg`,
      alt: `Product image ${index}`,
    }));
    rerender(<ProductGallerySection variant="grid" images={manyImages} />);
    expect(
      container.querySelectorAll(".puzzle-product-gallery__thumbnails > li"),
    ).toHaveLength(40);
  });

  it("rejects an unknown initial image ID", () => {
    expect(() =>
      render(
        <ProductGallerySection images={images} initialImageId="missing" />,
      ),
    ).toThrow('Unknown initial product gallery image "missing".');
  });
});
