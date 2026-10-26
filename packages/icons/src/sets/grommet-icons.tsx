import { Icon, type IconProps } from "../icon";
import type { GrommetIconsIconName } from "./grommet-icons.types.ts";

const prefix = "grommet-icons" as const;

type GrommetIconsIconProps = Omit<IconProps, "name"> & {
  name: GrommetIconsIconName;
};

const GrommetIconsIcon = ({ name, ...props }: GrommetIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GrommetIconsIcon, type GrommetIconsIconProps };
