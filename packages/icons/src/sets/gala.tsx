import { Icon, type IconProps } from "../icon";
import type { GalaIconName } from "./gala.types.ts";

const prefix = "gala" as const;

type GalaIconProps = Omit<IconProps, "name"> & {
  name: GalaIconName;
};

const GalaIcon = ({ name, ...props }: GalaIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GalaIcon, type GalaIconProps };
