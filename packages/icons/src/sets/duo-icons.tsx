import { Icon, type IconProps } from "../icon";
import type { DuoIconsIconName } from "./duo-icons.types.ts";

const prefix = "duo-icons" as const;

type DuoIconsIconProps = Omit<IconProps, "name"> & {
  name: DuoIconsIconName;
};

const DuoIconsIcon = ({ name, ...props }: DuoIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { DuoIconsIcon, type DuoIconsIconProps };
