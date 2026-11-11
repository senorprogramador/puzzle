import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const StoreHero = createHeroPreset<HeroProps>({
  layout: "split",
  mediaPosition: "right",
  alignment: "start",
  height: "large",
  theme: "light",
  overlay: "none",
  contentWidth: "normal",
});

export { StoreHero };
