import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const ComingSoonHero = createHeroPreset<HeroProps>({
  layout: "centered",
  alignment: "center",
  height: "viewport",
  theme: "dark",
  overlay: "none",
  contentWidth: "narrow",
});

export { ComingSoonHero };
