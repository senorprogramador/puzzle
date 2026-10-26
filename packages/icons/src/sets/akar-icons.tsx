import { Icon, type IconProps } from "../icon";
import type { AkarIconsIconName } from "./akar-icons.types.ts";

const prefix = "akar-icons" as const;

type AkarIconsIconProps = Omit<IconProps, "name"> & {
  name: AkarIconsIconName;
};

const AkarIconsIcon = ({ name, ...props }: AkarIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { AkarIconsIcon, type AkarIconsIconProps };
