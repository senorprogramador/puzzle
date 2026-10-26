import { Icon, type IconProps } from "../icon";
import type { HeroiconsIconName } from "./heroicons.types.ts";

const prefix = "heroicons" as const;

type HeroiconsIconProps = Omit<IconProps, "name"> & {
  name: HeroiconsIconName;
};

const HeroiconsIcon = ({ name, ...props }: HeroiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { HeroiconsIcon, type HeroiconsIconProps };
