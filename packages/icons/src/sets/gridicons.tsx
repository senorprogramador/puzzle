import { Icon, type IconProps } from "../icon";
import type { GridiconsIconName } from "./gridicons.types.ts";

const prefix = "gridicons" as const;

type GridiconsIconProps = Omit<IconProps, "name"> & {
  name: GridiconsIconName;
};

const GridiconsIcon = ({ name, ...props }: GridiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GridiconsIcon, type GridiconsIconProps };
