import type { HeroProps } from "./hero.types";

export const mergeHeroPresetProps = <T extends HeroProps>(
  defaults: Partial<HeroProps>,
  props: T,
): T & Partial<HeroProps> => ({
  ...defaults,
  ...props,
});
