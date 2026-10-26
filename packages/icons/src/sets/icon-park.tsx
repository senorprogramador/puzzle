import { Icon, type IconProps } from "../icon";
import type { IconParkIconName } from "./icon-park.types.ts";

const prefix = "icon-park" as const;

type IconParkIconProps = Omit<IconProps, "name"> & {
  name: IconParkIconName;
};

const IconParkIcon = ({ name, ...props }: IconParkIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconParkIcon, type IconParkIconProps };
