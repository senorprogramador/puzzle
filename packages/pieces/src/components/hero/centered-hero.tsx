import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const CenteredHero = createHeroPreset<HeroProps>({
  layout: "centered",
  alignment: "center",
  height: "auto",
  theme: "light",
  overlay: "none",
  contentWidth: "normal",
});

export { CenteredHero };
