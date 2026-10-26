import { Icon, type IconProps } from "../icon";
import type { UnjsIconName } from "./unjs.types.ts";

const prefix = "unjs" as const;

type UnjsIconProps = Omit<IconProps, "name"> & {
  name: UnjsIconName;
};

const UnjsIcon = ({ name, ...props }: UnjsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { UnjsIcon, type UnjsIconProps };
