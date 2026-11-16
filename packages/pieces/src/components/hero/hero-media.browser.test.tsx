import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeroVideo } from "./hero-video";
import { ImageHero } from "./image-hero";
import { VideoHero } from "./video-hero";

afterEach(cleanup);

describe("Hero video media", () => {
  it("renders autoplay-safe, decorative video sources and their poster fallback", () => {
    const { container } = render(
      <VideoHero
        title="Video destination"
        backgroundVideo={{
          src: "/intro.mp4",
          type: "video/mp4",
          poster: "/intro-poster.jpg",
        }}
      />,
    );
    const video = container.querySelector("video")!;
    const source = video.querySelector("source");

    expect(video).toHaveProperty("muted", true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).toHaveAttribute("poster", "/intro-poster.jpg");
    expect(video).toHaveAttribute("aria-hidden", "true");
    expect(video).toHaveAttribute("tabindex", "-1");
    expect(video).not.toHaveAttribute("controls");
    expect(source).toHaveAttribute("src", "/intro.mp4");
    expect(source).toHaveAttribute("type", "video/mp4");
    expect(container.querySelector("section")).toHaveAttribute(
      "data-height",
      "viewport",
    );
  });

  it("synchronizes playback with reduced-motion changes and cleans up", () => {
    let matches = true;
    let changeHandler: (() => void) | undefined;
    const removeEventListener = vi.fn();
    vi.spyOn(window, "matchMedia").mockImplementation(() => ({
      get matches() {
        return matches;
      },
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject | null,
      ) => {
        changeHandler = listener as () => void;
      },
      removeEventListener,
      addListener() {},
      removeListener() {},
      dispatchEvent: () => true,
    }) as MediaQueryList);
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});

    const { unmount } = render(
      <HeroVideo source={{ src: "/motion.mp4", poster: "/still.jpg" }} />,
    );

    expect(pause).toHaveBeenCalled();
    expect(play).not.toHaveBeenCalled();

    matches = false;
    changeHandler?.();
    expect(play).toHaveBeenCalledOnce();

    matches = true;
    changeHandler?.();
    expect(pause).toHaveBeenCalledTimes(2);

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
    expect(pause).toHaveBeenCalledTimes(3);
  });
});

describe("ImageHero media", () => {
  it("loads the background eagerly as decorative media and preserves responsive accessible media", () => {
    const { container, getByRole } = render(
      <ImageHero
        title="Responsive product"
        backgroundImage="/fallback.jpg"
        mediaPosition="right"
        media={
          <picture>
            <source
              media="(min-width: 60rem)"
              srcSet="/product-wide.webp"
              type="image/webp"
            />
            <img src="/product.jpg" alt="Product displayed in a room" />
          </picture>
        }
      />,
    );
    const background = container.querySelector(
      '.puzzle-hero__background-image[src="/fallback.jpg"]',
    );

    expect(background).toHaveAttribute("alt", "");
    expect(background).toHaveAttribute("loading", "eager");
    expect(background?.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(getByRole("img", { name: "Product displayed in a room" })).toHaveAttribute(
      "src",
      "/product.jpg",
    );
    expect(container.querySelector('source[media="(min-width: 60rem)"]')).toHaveAttribute(
      "srcset",
      "/product-wide.webp",
    );
  });

  it("keeps hero content available after a background image fails to load", () => {
    const { container, getByRole } = render(
      <ImageHero
        backgroundImage="/missing-background.jpg"
        title="Still available"
        actions={<button type="button">Continue</button>}
      />,
    );
    const image = container.querySelector(".puzzle-hero__background-image")!;

    image.dispatchEvent(new Event("error"));

    expect(getByRole("heading", { name: "Still available" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Continue" })).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/missing-background.jpg");
  });
});
