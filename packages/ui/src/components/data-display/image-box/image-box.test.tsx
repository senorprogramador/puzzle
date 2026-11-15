import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImageBox, type ImageBoxImage } from "./index";

afterEach(cleanup);

const createImages = (count: number): ImageBoxImage[] =>
  Array.from({ length: count }, (_, index) => ({
    src: `/image-${index + 1}.jpg`,
    alt: `Photo ${index + 1}`,
    title: `Photo title ${index + 1}`,
  }));

describe("ImageBox", () => {
  it.each([1, 2, 3, 4, 5, 6, 10, 25, 100])(
    "renders at most five images from a %s-image collection",
    (count) => {
      const { container } = render(<ImageBox images={createImages(count)} />);
      const renderedImages = container.querySelectorAll("img");

      expect(renderedImages).toHaveLength(Math.min(count, 5));
      expect(renderedImages[0]).toHaveAttribute("src", "/image-1.jpg");
      expect(renderedImages[0]).toHaveAttribute("alt", "Photo 1");
    },
  );

  it("renders nothing for an empty collection", () => {
    const { container } = render(<ImageBox images={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("supports server rendering", () => {
    const markup = renderToString(<ImageBox images={createImages(3)} />);

    expect(markup).toContain('aria-label="Photo gallery with 3 photos"');
    expect(markup).toContain('alt="Photo 3"');
  });

  it("preserves image order and exposes the total count to assistive technology", () => {
    render(<ImageBox images={createImages(4)} />);

    expect(screen.getByRole("group", { name: "Photo gallery with 4 photos" })).toBeTruthy();
    expect(screen.getAllByRole("img").map((image) => image.getAttribute("alt"))).toEqual([
      "Photo 1",
      "Photo 2",
      "Photo 3",
      "Photo 4",
    ]);
  });

  it("eagerly prioritizes the main image and lazy-loads supporting images", () => {
    const { container } = render(<ImageBox images={createImages(3)} />);
    const images = container.querySelectorAll("img");

    expect(images[0]).toHaveAttribute("loading", "eager");
    expect(images[0]).toHaveAttribute("fetchpriority", "high");
    expect(images[0]).toHaveAttribute("decoding", "async");
    expect(images[1]).toHaveAttribute("loading", "lazy");
    expect(images[1]).toHaveAttribute("decoding", "async");
    expect(images[0]).toHaveStyle({ objectFit: "cover" });
  });

  it.each([
    [6, "+1"],
    [10, "+5"],
    [100, "+95"],
  ])("keeps the fifth image beneath the correct overflow for %i images", (count, label) => {
    const { container } = render(<ImageBox images={createImages(count)} />);
    const fifthTile = container.querySelector('[data-image-index="4"]');

    expect(fifthTile?.querySelector("img")).toHaveAttribute("src", "/image-5.jpg");
    expect(fifthTile?.querySelector(".puzzle-image-box__overflow")).toHaveTextContent(label);
    expect(container.querySelectorAll(".puzzle-image-box__overflow")).toHaveLength(1);
  });

  it("omits the overflow indicator for five images", () => {
    const { container } = render(<ImageBox images={createImages(5)} />);

    expect(container.querySelector(".puzzle-image-box__overflow")).toBeNull();
  });

  it("uses the supplied ratio, gap, radius and class name", () => {
    const { container } = render(
      <ImageBox
        images={createImages(1)}
        aspectRatio={1.5}
        gap={12}
        radius="1rem"
        className="custom-gallery"
      />,
    );
    const gallery = container.firstElementChild as HTMLElement;

    expect(gallery).toHaveClass("custom-gallery");
    expect(gallery.style.getPropertyValue("--puzzle-image-box-aspect-ratio")).toBe("1.5");
    expect(gallery.style.getPropertyValue("--puzzle-image-box-gap")).toBe("12px");
    expect(gallery.style.getPropertyValue("--puzzle-image-box-radius")).toBe("1rem");
  });

  it("rejects invalid numeric dimensions", () => {
    expect(() => render(<ImageBox images={createImages(1)} aspectRatio={0} />)).toThrow(
      RangeError,
    );
    expect(() =>
      render(<ImageBox images={createImages(1)} gap={-1} />),
    ).toThrow(RangeError);
  });

  it("updates the visible images and overflow count when props change", () => {
    const { rerender, container } = render(<ImageBox images={createImages(2)} />);

    rerender(<ImageBox images={createImages(10)} />);

    expect(container.querySelectorAll("img")).toHaveLength(5);
    expect(container.querySelector(".puzzle-image-box__overflow")).toHaveTextContent("+5");
    expect(screen.getByRole("group", { name: "Photo gallery with 10 photos" })).toBeTruthy();
  });

  it("passes the original image and zero-based index to image clicks", async () => {
    const user = userEvent.setup();
    const images = createImages(3);
    const onImageClick = vi.fn();

    render(<ImageBox images={images} onImageClick={onImageClick} />);
    await user.click(screen.getByRole("button", { name: "Photo 2" }));

    expect(onImageClick).toHaveBeenCalledWith(images[1], 1);
  });

  it("supports native keyboard activation for image buttons", async () => {
    const user = userEvent.setup();
    const onImageClick = vi.fn();

    render(<ImageBox images={createImages(2)} onImageClick={onImageClick} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Photo 1" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.tab();
    await user.keyboard(" ");

    expect(onImageClick).toHaveBeenCalledTimes(2);
  });

  it("calls view-all without triggering the underlying image callback", async () => {
    const user = userEvent.setup();
    const onImageClick = vi.fn();
    const onViewAll = vi.fn();

    const { container } = render(
      <ImageBox
        images={createImages(10)}
        onImageClick={onImageClick}
        onViewAll={onViewAll}
      />,
    );
    const viewAll = container.querySelector<HTMLButtonElement>(
      ".puzzle-image-box__overflow",
    )!;

    await user.click(viewAll);

    expect(onViewAll).toHaveBeenCalledOnce();
    expect(onImageClick).not.toHaveBeenCalled();
  });

  it("does not create controls when callbacks are absent", () => {
    render(<ImageBox images={createImages(10)} />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "View all 10 photos" })).toBeNull();
  });

  it("renders an accessible fallback when an image fails", () => {
    render(<ImageBox images={createImages(1)} />);
    fireEvent.error(screen.getByRole("img", { name: "Photo 1" }));

    expect(screen.getByRole("img", { name: "Photo 1" })).toBeTruthy();
  });

  it("shows a fallback for an empty image source", () => {
    render(<ImageBox images={[{ src: "", alt: "Unavailable photo" }]} />);

    expect(screen.getByRole("img", { name: "Unavailable photo" })).toBeTruthy();
  });
});
