import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { AkarIconsIconName } from "./akar-icons.types.ts";

const prefix = "akar-icons" as const;

type SSRAkarIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: AkarIconsIconName;
};

const AkarIconsIcon = ({ name, ...props }: SSRAkarIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { AkarIconsIcon, type SSRAkarIconsIconProps };
