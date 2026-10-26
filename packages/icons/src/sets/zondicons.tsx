import { Icon, type IconProps } from "../icon";
import type { ZondiconsIconName } from "./zondicons.types.ts";

const prefix = "zondicons" as const;

type ZondiconsIconProps = Omit<IconProps, "name"> & {
  name: ZondiconsIconName;
};

const ZondiconsIcon = ({ name, ...props }: ZondiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ZondiconsIcon, type ZondiconsIconProps };
