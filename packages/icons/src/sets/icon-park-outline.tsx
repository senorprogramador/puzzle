import { Icon, type IconProps } from "../icon";
import type { IconParkOutlineIconName } from "./icon-park-outline.types.ts";

const prefix = "icon-park-outline" as const;

type IconParkOutlineIconProps = Omit<IconProps, "name"> & {
  name: IconParkOutlineIconName;
};

const IconParkOutlineIcon = ({ name, ...props }: IconParkOutlineIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconParkOutlineIcon, type IconParkOutlineIconProps };
