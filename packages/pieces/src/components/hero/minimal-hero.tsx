import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const MinimalHero = createHeroPreset<HeroProps>({
  layout: "centered",
  alignment: "start",
  height: "auto",
  theme: "light",
  overlay: "none",
  contentWidth: "narrow",
});

export { MinimalHero };
