import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent as browserUserEvent } from "vitest/browser";

import { Hero } from "../hero";
import {
  AccommodationHero,
  AgencyHero,
  CenteredHero,
  SplitHero,
} from "./index";

afterEach(() => {
  cleanup();
});

describe("Hero browser behavior", () => {
  it("renders the hero heading and description", async () => {
    render(
      <Hero
        title="Discover something new"
        description="A responsive hero component."
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Discover something new",
      }),
    ).toBeVisible();

    expect(screen.getByText("A responsive hero component.")).toBeVisible();
  });

  it("renders accessible media", async () => {
    render(
      <Hero
        title="Explore the world"
        media={<img src="/test-image.jpg" alt="Example landscape" />}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Example landscape",
      }),
    ).toBeVisible();
  });

  it("renders the primary CTA and handles interaction", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Hero
        title="Get started"
        actions={
          <button type="button" onClick={onClick}>
            Start now
          </button>
        }
      />,
    );

    const button = screen.getByRole("button", {
      name: "Start now",
    });

    expect(button).toBeVisible();

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports browser interaction with hero actions", async () => {
    const onClick = vi.fn();

    render(
      <Hero
        title="Explore"
        actions={
          <button type="button" onClick={onClick}>
            Explore now
          </button>
        }
      />,
    );

    await browserUserEvent.click(
      screen.getByRole("button", {
        name: "Explore now",
      }),
    );

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports keyboard interaction with CTA elements", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Hero
        title="Keyboard navigation"
        actions={
          <button type="button" onClick={onClick}>
            Continue
          </button>
        }
      />,
    );

    const button = screen.getByRole("button", {
      name: "Continue",
    });

    button.focus();

    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports custom content inside the hero", () => {
    render(
      <Hero title="Custom content">
        <div>
          <label htmlFor="hero-email">Email</label>
          <input id="hero-email" type="email" />
        </div>
      </Hero>,
    );

    expect(screen.getByLabelText("Email")).toBeVisible();
  });

  it("supports background images without exposing decorative images to assistive technology", () => {
    const { container } = render(
      <Hero backgroundImage="/hero.jpg" title="Background image" />,
    );

    const image = container.querySelector(".puzzle-hero__background-image");

    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("alt", "");
    expect(image?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("supports background videos", () => {
    const { container } = render(
      <Hero
        backgroundVideo={{
          src: "/hero.mp4",
          type: "video/mp4",
          poster: "/hero-poster.jpg",
        }}
        title="Video background"
      />,
    );

    const video = container.querySelector("video");

    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("muted");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
  });

  it("supports custom accessible labels", () => {
    render(<Hero ariaLabel="Main introduction" title="Welcome" />);

    expect(
      screen.getByRole("region", {
        name: "Main introduction",
      }),
    ).toBeVisible();
  });
});

describe("Hero responsive configuration", () => {
  it("exposes the desktop layout configuration", () => {
    render(
      <Hero
        testId="responsive-hero"
        layout="split"
        mediaPosition="right"
        title="Responsive"
        media={<img src="/image.jpg" alt="Landscape" />}
      />,
    );

    const hero = screen.getByTestId("responsive-hero");

    expect(hero).toHaveAttribute("data-layout", "split");
    expect(hero).toHaveAttribute("data-media-position", "right");
    expect(hero).toHaveAttribute("data-reverse-mobile", "true");
  });

  it("exposes the mobile reversal configuration", () => {
    render(
      <Hero
        testId="normal-order-hero"
        layout="split"
        reverseOnMobile={false}
        title="Normal order"
        media={<img src="/image.jpg" alt="Product" />}
      />,
    );

    expect(screen.getByTestId("normal-order-hero")).toHaveAttribute(
      "data-reverse-mobile",
      "false",
    );
  });

  it("renders the content and media layout hooks", () => {
    render(
      <Hero
        testId="layout-hero"
        title="Layout"
        media={<img src="/image.jpg" alt="Product" />}
      />,
    );

    const hero = screen.getByTestId("layout-hero");

    expect(hero.querySelector("[data-hero-inner]")).not.toBeNull();

    expect(hero.querySelector("[data-hero-content]")).not.toBeNull();

    expect(hero.querySelector("[data-hero-media]")).not.toBeNull();
  });

  it("supports background media without a separate media column", () => {
    render(
      <Hero
        testId="background-hero"
        mediaPosition="background"
        media={<img src="/image.jpg" alt="Background" />}
        title="Background"
      />,
    );

    const hero = screen.getByTestId("background-hero");

    expect(hero).toHaveAttribute("data-has-background", "true");

    expect(hero.querySelector("[data-hero-media]")).toBeNull();

    expect(hero.querySelector(".puzzle-hero__background-media")).not.toBeNull();
  });
});

describe("Hero presets in browser", () => {
  it("renders SplitHero", () => {
    render(<SplitHero testId="split-hero" title="Split layout" />);

    expect(screen.getByTestId("split-hero")).toHaveAttribute(
      "data-layout",
      "split",
    );
  });

  it("renders CenteredHero", () => {
    render(<CenteredHero testId="centered-hero" title="Centered layout" />);

    expect(screen.getByTestId("centered-hero")).toHaveAttribute(
      "data-layout",
      "centered",
    );
  });

  it("renders AgencyHero", () => {
    render(<AgencyHero testId="agency-hero" title="Agency" />);

    expect(screen.getByTestId("agency-hero")).toHaveAttribute(
      "data-theme",
      "dark",
    );
  });

  it("renders AccommodationHero", () => {
    render(
      <AccommodationHero
        testId="accommodation-hero"
        title="Stay in Andalusia"
      />,
    );

    expect(screen.getByTestId("accommodation-hero")).toHaveAttribute(
      "data-media-position",
      "background",
    );
  });
});
