import { Icon, type IconProps } from "../icon";
import type { FlatColorIconsIconName } from "./flat-color-icons.types.ts";

const prefix = "flat-color-icons" as const;

type FlatColorIconsIconProps = Omit<IconProps, "name"> & {
  name: FlatColorIconsIconName;
};

const FlatColorIconsIcon = ({ name, ...props }: FlatColorIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlatColorIconsIcon, type FlatColorIconsIconProps };
