import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GridiconsIconName } from "./gridicons.types.ts";

const prefix = "gridicons" as const;

type SSRGridiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: GridiconsIconName;
};

const GridiconsIcon = ({ name, ...props }: SSRGridiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GridiconsIcon, type SSRGridiconsIconProps };
