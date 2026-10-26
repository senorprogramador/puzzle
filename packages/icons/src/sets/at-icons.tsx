import { Icon, type IconProps } from "../icon";
import type { AtIconsIconName } from "./at-icons.types.ts";

const prefix = "at-icons" as const;

type AtIconsIconProps = Omit<IconProps, "name"> & {
  name: AtIconsIconName;
};

const AtIconsIcon = ({ name, ...props }: AtIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { AtIconsIcon, type AtIconsIconProps };
