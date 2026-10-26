import { Icon, type IconProps } from "../icon";
import type { HeroiconsOutlineIconName } from "./heroicons-outline.types.ts";

const prefix = "heroicons-outline" as const;

type HeroiconsOutlineIconProps = Omit<IconProps, "name"> & {
  name: HeroiconsOutlineIconName;
};

const HeroiconsOutlineIcon = ({ name, ...props }: HeroiconsOutlineIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { HeroiconsOutlineIcon, type HeroiconsOutlineIconProps };
