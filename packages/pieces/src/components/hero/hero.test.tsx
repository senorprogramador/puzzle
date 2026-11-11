import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  Hero,
  SplitHero,
  CenteredHero,
  FullScreenHero,
  VideoHero,
  ImageHero,
  MinimalHero,
  EditorialHero,
  AgencyHero,
  ProductHero,
  SaaSHero,
  StoreHero,
  RestaurantHero,
  AccommodationHero,
  PrintShopHero,
  DashboardWelcomeHero,
  AppHero,
  CampaignHero,
  ComingSoonHero,
  SearchHero,
} from ".";

import type { ComponentType } from "react";
import type { HeroProps } from "./hero.types";

const presets: {
  name: string;
  component: ComponentType<HeroProps>;
  expectedLayout: string;
  expectedTheme: string;
}[] = [
  {
    name: "SplitHero",
    component: SplitHero,
    expectedLayout: "split",
    expectedTheme: "light",
  },
  {
    name: "CenteredHero",
    component: CenteredHero,
    expectedLayout: "centered",
    expectedTheme: "light",
  },
  {
    name: "FullScreenHero",
    component: FullScreenHero,
    expectedLayout: "full-width",
    expectedTheme: "dark",
  },
  {
    name: "MinimalHero",
    component: MinimalHero,
    expectedLayout: "centered",
    expectedTheme: "light",
  },
  {
    name: "EditorialHero",
    component: EditorialHero,
    expectedLayout: "asymmetric",
    expectedTheme: "light",
  },
  {
    name: "AgencyHero",
    component: AgencyHero,
    expectedLayout: "asymmetric",
    expectedTheme: "dark",
  },
  {
    name: "ProductHero",
    component: ProductHero,
    expectedLayout: "split",
    expectedTheme: "light",
  },
  {
    name: "SaaSHero",
    component: SaaSHero,
    expectedLayout: "asymmetric",
    expectedTheme: "light",
  },
  {
    name: "StoreHero",
    component: StoreHero,
    expectedLayout: "split",
    expectedTheme: "light",
  },
  {
    name: "RestaurantHero",
    component: RestaurantHero,
    expectedLayout: "full-width",
    expectedTheme: "dark",
  },
  {
    name: "AccommodationHero",
    component: AccommodationHero,
    expectedLayout: "full-width",
    expectedTheme: "dark",
  },
  {
    name: "PrintShopHero",
    component: PrintShopHero,
    expectedLayout: "split",
    expectedTheme: "light",
  },
  {
    name: "DashboardWelcomeHero",
    component: DashboardWelcomeHero,
    expectedLayout: "full-width",
    expectedTheme: "light",
  },
  {
    name: "AppHero",
    component: AppHero,
    expectedLayout: "split",
    expectedTheme: "light",
  },
  {
    name: "CampaignHero",
    component: CampaignHero,
    expectedLayout: "full-width",
    expectedTheme: "contrast",
  },
  {
    name: "ComingSoonHero",
    component: ComingSoonHero,
    expectedLayout: "centered",
    expectedTheme: "dark",
  },
  {
    name: "SearchHero",
    component: SearchHero,
    expectedLayout: "centered",
    expectedTheme: "light",
  },
];

describe("Hero", () => {
  it("renders the title as a heading", () => {
    render(<Hero title="Welcome to Puzzle" />);

    expect(
      screen.getByRole("heading", {
        name: "Welcome to Puzzle",
      }),
    ).toBeDefined();
  });

  it("renders its description", () => {
    render(<Hero description="A flexible hero component." />);

    expect(screen.getByText("A flexible hero component.")).toBeDefined();
  });

  it("renders custom children", () => {
    render(
      <Hero>
        <button type="button">Get started</button>
      </Hero>,
    );

    expect(
      screen.getByRole("button", {
        name: "Get started",
      }),
    ).toBeDefined();
  });

  it("renders media", () => {
    render(<Hero media={<img src="/product.jpg" alt="Product" />} />);

    expect(screen.getByRole("img", { name: "Product" })).toBeDefined();
  });

  it("renders actions", () => {
    render(<Hero actions={<button type="button">Explore</button>} />);

    expect(screen.getByRole("button", { name: "Explore" })).toBeDefined();
  });

  it("supports custom layout properties", () => {
    const { container } = render(
      <Hero
        layout="asymmetric"
        alignment="center"
        height="large"
        theme="dark"
        overlay="gradient"
      />,
    );

    const hero = container.querySelector("section");

    expect(hero?.getAttribute("data-layout")).toBe("asymmetric");

    expect(hero?.getAttribute("data-alignment")).toBe("center");

    expect(hero?.getAttribute("data-height")).toBe("large");

    expect(hero?.getAttribute("data-theme")).toBe("dark");

    expect(hero?.getAttribute("data-overlay")).toBe("gradient");
  });

  it("supports background images", () => {
    const { container } = render(
      <ImageHero backgroundImage="/hero.jpg" title="Image hero" />,
    );

    const background = container.querySelector('img[src="/hero.jpg"]');

    expect(background).not.toBeNull();
  });

  it("supports background videos", () => {
    const { container } = render(
      <VideoHero
        backgroundVideo={{
          src: "/hero.mp4",
          type: "video/mp4",
          poster: "/hero-poster.jpg",
        }}
        title="Video hero"
      />,
    );

    expect(container.querySelector("video")).not.toBeNull();
  });
});

describe("Hero presets", () => {
  it.each(presets)(
    "$name applies its default configuration",
    ({ component: Component, expectedLayout, expectedTheme }) => {
      const { container } = render(<Component title="Preset test" />);

      const hero = container.querySelector("section");

      expect(hero?.getAttribute("data-layout")).toBe(expectedLayout);

      expect(hero?.getAttribute("data-theme")).toBe(expectedTheme);
    },
  );

  it.each(presets)(
    "$name allows configuration overrides",
    ({ component: Component }) => {
      const { container } = render(
        <Component title="Override test" layout="centered" theme="contrast" />,
      );

      const hero = container.querySelector("section");

      expect(hero?.getAttribute("data-layout")).toBe("centered");

      expect(hero?.getAttribute("data-theme")).toBe("contrast");
    },
  );

  it("ImageHero allows custom layouts", () => {
    const { container } = render(
      <ImageHero backgroundImage="/hero.jpg" layout="split" theme="brand" />,
    );

    const hero = container.querySelector("section");

    expect(hero?.getAttribute("data-layout")).toBe("split");
    expect(hero?.getAttribute("data-theme")).toBe("brand");
  });

  it("VideoHero allows custom heights", () => {
    const { container } = render(
      <VideoHero backgroundVideo={{ src: "/hero.mp4" }} height="large" />,
    );

    const hero = container.querySelector("section");

    expect(hero?.getAttribute("data-height")).toBe("large");
  });
});
