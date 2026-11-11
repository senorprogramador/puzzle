import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const RestaurantHero = createHeroPreset<HeroProps>({
  layout: "full-width",
  mediaPosition: "background",
  alignment: "start",
  height: "large",
  theme: "dark",
  overlay: "gradient",
  contentWidth: "normal",
});

export { RestaurantHero };
