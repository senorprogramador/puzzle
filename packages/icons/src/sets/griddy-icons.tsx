import { Icon, type IconProps } from "../icon";
import type { GriddyIconsIconName } from "./griddy-icons.types.ts";

const prefix = "griddy-icons" as const;

type GriddyIconsIconProps = Omit<IconProps, "name"> & {
  name: GriddyIconsIconName;
};

const GriddyIconsIcon = ({ name, ...props }: GriddyIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GriddyIconsIcon, type GriddyIconsIconProps };
