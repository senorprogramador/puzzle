import { Icon, type IconProps } from "../icon";
import type { MeteorIconsIconName } from "./meteor-icons.types.ts";

const prefix = "meteor-icons" as const;

type MeteorIconsIconProps = Omit<IconProps, "name"> & {
  name: MeteorIconsIconName;
};

const MeteorIconsIcon = ({ name, ...props }: MeteorIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MeteorIconsIcon, type MeteorIconsIconProps };
