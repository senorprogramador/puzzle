import { Icon, type IconProps } from "../icon";
import type { IconoirIconName } from "./iconoir.types.ts";

const prefix = "iconoir" as const;

type IconoirIconProps = Omit<IconProps, "name"> & {
  name: IconoirIconName;
};

const IconoirIcon = ({ name, ...props }: IconoirIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconoirIcon, type IconoirIconProps };
