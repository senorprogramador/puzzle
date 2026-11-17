import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { VideoSection } from "./video-section";

const video = {
  id: "hotel-tour",
  title: "Harbor House tour",
  sources: [{ src: "/hotel-tour.mp4", type: "video/mp4" }],
  poster: "/hotel-tour-poster.jpg",
  thumbnail: "/hotel-tour-thumb.jpg",
  duration: "03:24",
  description: "A short tour of the hotel and its shared spaces.",
  captions: [
    {
      src: "/hotel-tour.vtt",
      srclang: "en",
      label: "English",
      default: true,
    },
  ],
};

const matchMedia = (matches: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    () =>
      ({
        matches,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );

afterEach(() => {
  vi.restoreAllMocks();
});

describe("VideoSection", () => {
  it("renders native accessible controls, poster, captions, and responsive ratio", () => {
    const { container } = render(
      <VideoSection
        title="A look inside Harbor House"
        variant="tutorial"
        videos={[video]}
        aspectRatio="4 / 3"
      />,
    );

    const player = screen.getByLabelText("Video: Harbor House tour");
    expect(player).toHaveAttribute("controls");
    expect(player).toHaveAttribute("preload", "none");
    expect(player).toHaveAttribute("poster", "/hotel-tour-poster.jpg");
    expect(container.querySelector("source")).toHaveAttribute(
      "src",
      "/hotel-tour.mp4",
    );
    expect(container.querySelector("track")).toHaveAttribute(
      "srcLang",
      "en",
    );
    expect(container.querySelector(".puzzle-video-section__player")).toHaveStyle({
      aspectRatio: "4 / 3",
    });
  });

  it("only enables autoplay for muted media when reduced motion is not requested", () => {
    matchMedia(false);
    const { rerender } = render(
      <VideoSection title="Autoplay rules" videos={[video]} autoplay />,
    );
    const player = screen.getByLabelText("Video: Harbor House tour");
    expect(player).not.toHaveAttribute("autoplay");

    rerender(
      <VideoSection title="Autoplay rules" videos={[video]} autoplay muted />,
    );
    expect(player).toHaveAttribute("autoplay");

    vi.restoreAllMocks();
    matchMedia(true);
    rerender(
      <VideoSection title="Autoplay rules" videos={[video]} autoplay muted />,
    );
    expect(player).not.toHaveAttribute("autoplay");
  });

  it("loads a lightbox player only after an accessible trigger is activated", async () => {
    render(
      <VideoSection
        title="Video library"
        variant="lightbox"
        videos={[video]}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open Video: Harbor House tour in a dialog",
      }),
    );
    expect(
      await screen.findByRole("dialog", { name: "Harbor House tour" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Video: Harbor House tour")).toHaveAttribute(
      "controls",
    );
  });

  it("renders empty data with a shared empty state", () => {
    render(<VideoSection title="Product videos" videos={[]} />);
    expect(screen.getByRole("heading", { name: "No videos available" })).toBeVisible();
  });
});
