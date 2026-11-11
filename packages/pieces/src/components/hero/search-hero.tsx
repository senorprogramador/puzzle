import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const SearchHero = createHeroPreset<HeroProps>({
  layout: "centered",
  alignment: "center",
  height: "large",
  theme: "light",
  overlay: "none",
  contentWidth: "wide",
});

export { SearchHero };
