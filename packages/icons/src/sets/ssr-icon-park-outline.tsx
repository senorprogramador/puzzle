import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IconParkOutlineIconName } from "./icon-park-outline.types.ts";

const prefix = "icon-park-outline" as const;

type SSRIconParkOutlineIconProps = Omit<SSRIconProps, "name"> & {
  name: IconParkOutlineIconName;
};

const IconParkOutlineIcon = ({ name, ...props }: SSRIconParkOutlineIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconParkOutlineIcon, type SSRIconParkOutlineIconProps };
