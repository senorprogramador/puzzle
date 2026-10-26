import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GriddyIconsIconName } from "./griddy-icons.types.ts";

const prefix = "griddy-icons" as const;

type SSRGriddyIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: GriddyIconsIconName;
};

const GriddyIconsIcon = ({ name, ...props }: SSRGriddyIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GriddyIconsIcon, type SSRGriddyIconsIconProps };
