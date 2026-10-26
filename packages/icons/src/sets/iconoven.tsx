import { Icon, type IconProps } from "../icon";
import type { IconovenIconName } from "./iconoven.types.ts";

const prefix = "iconoven" as const;

type IconovenIconProps = Omit<IconProps, "name"> & {
  name: IconovenIconName;
};

const IconovenIcon = ({ name, ...props }: IconovenIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconovenIcon, type IconovenIconProps };
