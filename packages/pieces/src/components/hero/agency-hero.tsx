import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const AgencyHero = createHeroPreset<HeroProps>({
  layout: "asymmetric",
  mediaPosition: "right",
  alignment: "start",
  height: "large",
  theme: "dark",
  overlay: "none",
  contentWidth: "normal",
});

export { AgencyHero };
