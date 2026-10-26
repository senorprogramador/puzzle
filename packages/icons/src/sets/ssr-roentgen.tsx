import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { RoentgenIconName } from "./roentgen.types.ts";

const prefix = "roentgen" as const;

type SSRRoentgenIconProps = Omit<SSRIconProps, "name"> & {
  name: RoentgenIconName;
};

const RoentgenIcon = ({ name, ...props }: SSRRoentgenIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { RoentgenIcon, type SSRRoentgenIconProps };
