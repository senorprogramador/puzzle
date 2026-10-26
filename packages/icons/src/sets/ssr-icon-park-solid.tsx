import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IconParkSolidIconName } from "./icon-park-solid.types.ts";

const prefix = "icon-park-solid" as const;

type SSRIconParkSolidIconProps = Omit<SSRIconProps, "name"> & {
  name: IconParkSolidIconName;
};

const IconParkSolidIcon = ({ name, ...props }: SSRIconParkSolidIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconParkSolidIcon, type SSRIconParkSolidIconProps };
