import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { HeroiconsSolidIconName } from "./heroicons-solid.types.ts";

const prefix = "heroicons-solid" as const;

type SSRHeroiconsSolidIconProps = Omit<SSRIconProps, "name"> & {
  name: HeroiconsSolidIconName;
};

const HeroiconsSolidIcon = ({ name, ...props }: SSRHeroiconsSolidIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { HeroiconsSolidIcon, type SSRHeroiconsSolidIconProps };
