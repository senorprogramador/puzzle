import { Icon, type IconProps } from "../icon";
import type { LetsIconsIconName } from "./lets-icons.types.ts";

const prefix = "lets-icons" as const;

type LetsIconsIconProps = Omit<IconProps, "name"> & {
  name: LetsIconsIconName;
};

const LetsIconsIcon = ({ name, ...props }: LetsIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LetsIconsIcon, type LetsIconsIconProps };
