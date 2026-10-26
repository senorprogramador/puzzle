import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FlatColorIconsIconName } from "./flat-color-icons.types.ts";

const prefix = "flat-color-icons" as const;

type SSRFlatColorIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: FlatColorIconsIconName;
};

const FlatColorIconsIcon = ({ name, ...props }: SSRFlatColorIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlatColorIconsIcon, type SSRFlatColorIconsIconProps };
