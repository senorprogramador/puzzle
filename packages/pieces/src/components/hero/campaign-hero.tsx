import { createHeroPreset } from "./create-hero-preset";
import type { HeroProps } from "./hero.types";

const CampaignHero = createHeroPreset<HeroProps>({
  layout: "full-width",
  mediaPosition: "background",
  alignment: "center",
  height: "large",
  theme: "contrast",
  overlay: "gradient",
  contentWidth: "wide",
});

export { CampaignHero };
