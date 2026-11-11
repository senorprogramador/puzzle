import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const SplitHero = createHeroPreset<HeroProps>({
  layout: "split",
  mediaPosition: "right",
  alignment: "start",
  height: "auto",
  theme: "light",
  overlay: "none",
});

export { SplitHero };
