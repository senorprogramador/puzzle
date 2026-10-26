import { Icon, type IconProps } from "../icon";
import type { CircleFlagsIconName } from "./circle-flags.types.ts";

const prefix = "circle-flags" as const;

type CircleFlagsIconProps = Omit<IconProps, "name"> & {
  name: CircleFlagsIconName;
};

const CircleFlagsIcon = ({ name, ...props }: CircleFlagsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CircleFlagsIcon, type CircleFlagsIconProps };
