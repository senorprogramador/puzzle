import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const DashboardWelcomeHero = createHeroPreset<HeroProps>({
  layout: "full-width",
  alignment: "start",
  height: "auto",
  theme: "light",
  overlay: "none",
  contentWidth: "full",
});

export { DashboardWelcomeHero };
