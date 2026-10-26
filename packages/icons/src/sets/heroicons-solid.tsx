import { Icon, type IconProps } from "../icon";
import type { HeroiconsSolidIconName } from "./heroicons-solid.types.ts";

const prefix = "heroicons-solid" as const;

type HeroiconsSolidIconProps = Omit<IconProps, "name"> & {
  name: HeroiconsSolidIconName;
};

const HeroiconsSolidIcon = ({ name, ...props }: HeroiconsSolidIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { HeroiconsSolidIcon, type HeroiconsSolidIconProps };
