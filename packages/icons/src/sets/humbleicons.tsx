import { Icon, type IconProps } from "../icon";
import type { HumbleiconsIconName } from "./humbleicons.types.ts";

const prefix = "humbleicons" as const;

type HumbleiconsIconProps = Omit<IconProps, "name"> & {
  name: HumbleiconsIconName;
};

const HumbleiconsIcon = ({ name, ...props }: HumbleiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { HumbleiconsIcon, type HumbleiconsIconProps };
