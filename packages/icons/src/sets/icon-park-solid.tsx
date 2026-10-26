import { Icon, type IconProps } from "../icon";
import type { IconParkSolidIconName } from "./icon-park-solid.types.ts";

const prefix = "icon-park-solid" as const;

type IconParkSolidIconProps = Omit<IconProps, "name"> & {
  name: IconParkSolidIconName;
};

const IconParkSolidIcon = ({ name, ...props }: IconParkSolidIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconParkSolidIcon, type IconParkSolidIconProps };
