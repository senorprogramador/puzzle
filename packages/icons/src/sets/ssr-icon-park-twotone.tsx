import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IconParkTwotoneIconName } from "./icon-park-twotone.types.ts";

const prefix = "icon-park-twotone" as const;

type SSRIconParkTwotoneIconProps = Omit<SSRIconProps, "name"> & {
  name: IconParkTwotoneIconName;
};

const IconParkTwotoneIcon = ({ name, ...props }: SSRIconParkTwotoneIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconParkTwotoneIcon, type SSRIconParkTwotoneIconProps };
