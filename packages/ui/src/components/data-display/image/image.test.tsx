import type { ComponentPropsWithRef } from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { Theme } from "@puzzle-ui/theme";

import { describe, expect, it, vi } from "vitest";

import { Image } from ".";

/**
 * Mock framework image component.
 */
const FrameworkImage = ({
  quality,
  preload,
  ...props
}: ComponentPropsWithRef<"img"> & {
  quality?: number;
  preload?: boolean;
}) => (
  <img
    {...props}
    data-quality={quality}
    data-preload={preload ? "true" : undefined}
  />
);

describe("Image", () => {
  it("renders an accessible native image", () => {
    render(
      <Image
        src="/images/product.webp"
        alt="Product photograph"
        width={800}
        height={600}
      />,
    );

    const image = screen.getByRole("img", {
      name: "Product photograph",
    });

    expect(image).toHaveAttribute("src", "/images/product.webp");
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "600");
  });

  it("supports decorative images", () => {
    render(
      <Image src="/images/decoration.webp" alt="" width={100} height={100} />,
    );

    expect(screen.getByAltText("")).toBeInTheDocument();
  });

  it("infers dimensions from static image sources", () => {
    const source = {
      src: "/images/mountain.webp",
      width: 1200,
      height: 800,
      blurDataURL: "data:image/jpeg;base64,AAAA",
    };

    render(<Image src={source} alt="Mountain landscape" />);

    const image = screen.getByRole("img", {
      name: "Mountain landscape",
    });

    expect(image).toHaveAttribute("src", source.src);
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "800");
  });

  it("uses an explicitly configured framework image component", () => {
    render(
      <Image
        component={FrameworkImage}
        src="/images/product.webp"
        alt="Product"
        quality={85}
        preload
      />,
    );

    const image = screen.getByRole("img", {
      name: "Product",
    });

    expect(image).toHaveAttribute("data-quality", "85");
    expect(image).toHaveAttribute("data-preload", "true");
  });

  it("uses the image component configured through Theme", () => {
    render(
      <Theme
        components={{
          image: FrameworkImage,
        }}
      >
        <Image src="/images/product.webp" alt="Product" quality={80} preload />
      </Theme>,
    );

    const image = screen.getByRole("img", {
      name: "Product",
    });

    expect(image).toHaveAttribute("data-quality", "80");
    expect(image).toHaveAttribute("data-preload", "true");
  });

  it("uses fallbackSrc when the primary image fails", () => {
    render(
      <Image
        src="/images/invalid.webp"
        fallbackSrc="/images/fallback.webp"
        alt="Product"
      />,
    );

    const originalImage = screen.getByRole("img", {
      name: "Product",
    });

    fireEvent.error(originalImage);

    const fallbackImage = screen.getByRole("img", {
      name: "Product",
    });

    expect(fallbackImage).toHaveAttribute("src", "/images/fallback.webp");
  });

  it("shows custom fallback content when the image fails", () => {
    render(
      <Image
        src="/images/invalid.webp"
        alt="Product photograph"
        fallback={<span>Image unavailable</span>}
      />,
    );

    fireEvent.error(
      screen.getByRole("img", {
        name: "Product photograph",
      }),
    );

    expect(
      screen.getByRole("img", {
        name: "Product photograph",
      }),
    ).toHaveTextContent("Image unavailable");
  });

  it("shows custom fallback when no source is provided", () => {
    render(
      <Image
        alt="Unavailable photograph"
        fallback={<span>Not available</span>}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Unavailable photograph",
      }),
    ).toHaveTextContent("Not available");
  });

  it("returns null when no source or fallback is available", () => {
    const { container } = render(<Image alt="Missing image" />);

    expect(container.firstChild).toBeNull();
  });

  it("ignores empty image sources", () => {
    const { container } = render(<Image src="" alt="Empty image" />);

    expect(container.firstChild).toBeNull();
  });

  it("supports responsive picture sources", () => {
    const { container } = render(
      <Image
        src="/images/desktop.webp"
        alt="Landscape"
        sources={[
          {
            srcSet: "/images/mobile.webp",
            media: "(max-width: 640px)",
          },
        ]}
      />,
    );

    const source = container.querySelector("picture source");

    expect(source).toHaveAttribute("srcset", "/images/mobile.webp");

    expect(source).toHaveAttribute("media", "(max-width: 640px)");
  });

  it("applies object-fit and object-position", () => {
    render(
      <Image
        src="/images/landscape.webp"
        alt="Landscape"
        fit="contain"
        position="top"
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Landscape",
      }),
    ).toHaveStyle({
      objectFit: "contain",
      objectPosition: "top",
    });
  });

  it("sets an aspect ratio on the image container", () => {
    const { container } = render(
      <Image
        src="/images/landscape.webp"
        alt="Landscape"
        aspectRatio="16 / 9"
      />,
    );

    expect(container.firstChild).toHaveStyle({
      aspectRatio: "16 / 9",
      width: "100%",
    });
  });

  it("supports external load callbacks", () => {
    const onLoad = vi.fn();

    render(<Image src="/images/product.webp" alt="Product" onLoad={onLoad} />);

    fireEvent.load(
      screen.getByRole("img", {
        name: "Product",
      }),
    );

    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it("supports external error callbacks", () => {
    const onError = vi.fn();

    render(
      <Image src="/images/invalid.webp" alt="Product" onError={onError} />,
    );

    fireEvent.error(
      screen.getByRole("img", {
        name: "Product",
      }),
    );

    expect(onError).toHaveBeenCalledTimes(1);
  });
});
