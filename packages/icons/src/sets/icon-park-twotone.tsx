import { Icon, type IconProps } from "../icon";
import type { IconParkTwotoneIconName } from "./icon-park-twotone.types.ts";

const prefix = "icon-park-twotone" as const;

type IconParkTwotoneIconProps = Omit<IconProps, "name"> & {
  name: IconParkTwotoneIconName;
};

const IconParkTwotoneIcon = ({ name, ...props }: IconParkTwotoneIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconParkTwotoneIcon, type IconParkTwotoneIconProps };
