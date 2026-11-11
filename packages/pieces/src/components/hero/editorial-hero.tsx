import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const EditorialHero = createHeroPreset<HeroProps>({
  layout: "asymmetric",
  mediaPosition: "right",
  alignment: "start",
  height: "large",
  theme: "light",
  overlay: "none",
  contentWidth: "normal",
});

export { EditorialHero };
