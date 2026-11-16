import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { createRef } from "react";

import {
  AccommodationHero,
  AgencyHero,
  AppHero,
  AsymmetricHero,
  CampaignHero,
  DashboardWelcomeHero,
  EditorialHero,
  FullScreenHero,
  PrintShopHero,
  ProductHero,
  RestaurantHero,
  SaaSHero,
  SplitHero,
  StoreHero,
} from "./index";

import type { ComponentType } from "react";
import type { HeroProps } from "./hero.types";

const presets: {
  name: string;
  component: ComponentType<HeroProps>;
  defaults: Required<
    Pick<
      HeroProps,
      | "layout"
      | "mediaPosition"
      | "alignment"
      | "height"
      | "theme"
      | "overlay"
      | "contentWidth"
    >
  >;
}[] = [
  {
    name: "AgencyHero",
    component: AgencyHero,
    defaults: {
      layout: "asymmetric",
      mediaPosition: "right",
      alignment: "start",
      height: "large",
      theme: "dark",
      overlay: "none",
      contentWidth: "normal",
    },
  },
  {
    name: "CampaignHero",
    component: CampaignHero,
    defaults: {
      layout: "full-width",
      mediaPosition: "background",
      alignment: "center",
      height: "large",
      theme: "contrast",
      overlay: "gradient",
      contentWidth: "wide",
    },
  },
  {
    name: "DashboardWelcomeHero",
    component: DashboardWelcomeHero,
    defaults: {
      layout: "full-width",
      mediaPosition: "right",
      alignment: "start",
      height: "auto",
      theme: "light",
      overlay: "none",
      contentWidth: "full",
    },
  },
  {
    name: "AsymmetricHero",
    component: AsymmetricHero,
    defaults: {
      layout: "asymmetric",
      mediaPosition: "right",
      alignment: "start",
      height: "large",
      theme: "light",
      overlay: "none",
      contentWidth: "normal",
    },
  },
  {
    name: "RestaurantHero",
    component: RestaurantHero,
    defaults: {
      layout: "full-width",
      mediaPosition: "background",
      alignment: "start",
      height: "large",
      theme: "dark",
      overlay: "gradient",
      contentWidth: "normal",
    },
  },
  {
    name: "FullScreenHero",
    component: FullScreenHero,
    defaults: {
      layout: "full-width",
      mediaPosition: "background",
      alignment: "center",
      height: "viewport",
      theme: "dark",
      overlay: "gradient",
      contentWidth: "wide",
    },
  },
  {
    name: "SplitHero",
    component: SplitHero,
    defaults: {
      layout: "split",
      mediaPosition: "right",
      alignment: "start",
      height: "large",
      theme: "light",
      overlay: "none",
      contentWidth: "normal",
    },
  },
];

const legacyAliases: {
  name: string;
  alias: ComponentType<HeroProps>;
  canonical: ComponentType<HeroProps>;
}[] = [
  { name: "AccommodationHero", alias: AccommodationHero, canonical: FullScreenHero },
  { name: "AppHero", alias: AppHero, canonical: SplitHero },
  { name: "EditorialHero", alias: EditorialHero, canonical: AsymmetricHero },
  { name: "PrintShopHero", alias: PrintShopHero, canonical: SplitHero },
  { name: "ProductHero", alias: ProductHero, canonical: SplitHero },
  { name: "SaaSHero", alias: SaaSHero, canonical: AsymmetricHero },
  { name: "StoreHero", alias: StoreHero, canonical: SplitHero },
];

describe("documented hero presets", () => {
  it.each(presets)(
    "$name applies every documented default",
    ({ component: Preset, defaults }) => {
      const { container } = render(<Preset title="Preset title" />);
      const hero = container.querySelector("section");

      expect(hero).toHaveAttribute("data-layout", defaults.layout);
      expect(hero).toHaveAttribute(
        "data-media-position",
        defaults.mediaPosition,
      );
      expect(hero).toHaveAttribute("data-alignment", defaults.alignment);
      expect(hero).toHaveAttribute("data-height", defaults.height);
      expect(hero).toHaveAttribute("data-theme", defaults.theme);
      expect(hero).toHaveAttribute("data-overlay", defaults.overlay);
      expect(hero).toHaveAttribute("data-content-width", defaults.contentWidth);
      expect(hero).toHaveTextContent("Preset title");
    },
  );

  it.each(legacyAliases)(
    "$name exports its canonical preset implementation",
    ({ alias, canonical }) => {
      expect(alias).toBe(canonical);
    },
  );

  it.each(presets)(
    "$name lets explicit props override defaults and preserves slots",
    ({ component: Preset }) => {
      const { container, getByRole, getByText } = render(
        <Preset
          as="article"
          titleAs="h2"
          id="custom-hero"
          className="consumer-class"
          contentClassName="consumer-content"
          layout="centered"
          mediaPosition="left"
          alignment="end"
          height="auto"
          theme="brand"
          overlay="subtle"
          contentWidth="narrow"
          title="Overridden title"
          media={<img src="/product.png" alt="Product preview" />}
          actions={<button type="button">Start now</button>}
          children={<span>Additional hero content</span>}
          meta="Product metadata"
          ariaLabel="Custom hero"
        />,
      );
      const hero = container.querySelector("article");

      expect(hero).toHaveAttribute("id", "custom-hero");
      expect(hero).toHaveClass("consumer-class");
      expect(hero).toHaveAttribute("aria-label", "Custom hero");
      expect(hero).toHaveAttribute("data-layout", "centered");
      expect(hero).toHaveAttribute("data-media-position", "left");
      expect(hero).toHaveAttribute("data-alignment", "end");
      expect(hero).toHaveAttribute("data-height", "auto");
      expect(hero).toHaveAttribute("data-theme", "brand");
      expect(hero).toHaveAttribute("data-overlay", "subtle");
      expect(hero).toHaveAttribute("data-content-width", "narrow");
      expect(
        getByRole("heading", { name: "Overridden title", level: 2 }),
      ).toBeInTheDocument();
      expect(getByRole("img", { name: "Product preview" })).toBeInTheDocument();
      expect(getByRole("button", { name: "Start now" })).toBeInTheDocument();
      expect(getByText("Product metadata")).toBeInTheDocument();
      expect(getByText("Additional hero content")).toBeInTheDocument();
      expect(container.querySelector(".consumer-content")).toBeInTheDocument();
    },
  );

  it("preserves refs on consumer media and child slots", () => {
    const mediaRef = createRef<HTMLImageElement>();
    const childRef = createRef<HTMLSpanElement>();

    render(
      <SplitHero
        media={<img ref={mediaRef} src="/product.png" alt="Product" />}
      >
        <span ref={childRef}>Consumer content</span>
      </SplitHero>,
    );

    expect(mediaRef.current).toBeInstanceOf(HTMLImageElement);
    expect(childRef.current).toBeInstanceOf(HTMLSpanElement);
  });
});
