import { Icon, type IconProps } from "../icon";
import type { DinkieIconsIconName } from "./dinkie-icons.types.ts";

const prefix = "dinkie-icons" as const;

type DinkieIconsIconProps = Omit<IconProps, "name"> & {
  name: DinkieIconsIconName;
};

const DinkieIconsIcon = ({ name, ...props }: DinkieIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { DinkieIconsIcon, type DinkieIconsIconProps };
