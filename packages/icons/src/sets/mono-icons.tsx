import { Icon, type IconProps } from "../icon";
import type { MonoIconsIconName } from "./mono-icons.types.ts";

const prefix = "mono-icons" as const;

type MonoIconsIconProps = Omit<IconProps, "name"> & {
  name: MonoIconsIconName;
};

const MonoIconsIcon = ({ name, ...props }: MonoIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MonoIconsIcon, type MonoIconsIconProps };
