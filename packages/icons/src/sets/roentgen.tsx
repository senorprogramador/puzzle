import { Icon, type IconProps } from "../icon";
import type { RoentgenIconName } from "./roentgen.types.ts";

const prefix = "roentgen" as const;

type RoentgenIconProps = Omit<IconProps, "name"> & {
  name: RoentgenIconName;
};

const RoentgenIcon = ({ name, ...props }: RoentgenIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { RoentgenIcon, type RoentgenIconProps };
