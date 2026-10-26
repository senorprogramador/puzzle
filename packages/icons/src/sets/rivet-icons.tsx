import { Icon, type IconProps } from "../icon";
import type { RivetIconsIconName } from "./rivet-icons.types.ts";

const prefix = "rivet-icons" as const;

type RivetIconsIconProps = Omit<IconProps, "name"> & {
  name: RivetIconsIconName;
};

const RivetIconsIcon = ({ name, ...props }: RivetIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { RivetIconsIcon, type RivetIconsIconProps };
