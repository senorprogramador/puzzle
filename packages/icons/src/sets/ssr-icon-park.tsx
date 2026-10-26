import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IconParkIconName } from "./icon-park.types.ts";

const prefix = "icon-park" as const;

type SSRIconParkIconProps = Omit<SSRIconProps, "name"> & {
  name: IconParkIconName;
};

const IconParkIcon = ({ name, ...props }: SSRIconParkIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconParkIcon, type SSRIconParkIconProps };
