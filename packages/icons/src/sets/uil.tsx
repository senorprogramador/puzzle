import { Icon, type IconProps } from "../icon";
import type { UilIconName } from "./uil.types.ts";

const prefix = "uil" as const;

type UilIconProps = Omit<IconProps, "name"> & {
  name: UilIconName;
};

const UilIcon = ({ name, ...props }: UilIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { UilIcon, type UilIconProps };
