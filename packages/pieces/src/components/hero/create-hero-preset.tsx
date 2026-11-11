import { Hero } from "./hero";
import { mergeHeroPresetProps } from "./hero.utils";

import type { HeroProps } from "./hero.types";

export const createHeroPreset = <T extends HeroProps>(
  defaults: Partial<HeroProps>,
) => {
  const HeroPreset = (props: T) => (
    <Hero {...mergeHeroPresetProps(defaults, props)} />
  );

  return HeroPreset;
};
