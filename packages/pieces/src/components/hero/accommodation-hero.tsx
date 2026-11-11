import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const AccommodationHero = createHeroPreset<HeroProps>({
  layout: "full-width",
  mediaPosition: "background",
  alignment: "center",
  height: "viewport",
  theme: "dark",
  overlay: "gradient",
  contentWidth: "wide",
});

export { AccommodationHero };
