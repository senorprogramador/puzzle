import { Icon, type IconProps } from "../icon";
import type { GgIconName } from "./gg.types.ts";

const prefix = "gg" as const;

type GgIconProps = Omit<IconProps, "name"> & {
  name: GgIconName;
};

const GgIcon = ({ name, ...props }: GgIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GgIcon, type GgIconProps };
