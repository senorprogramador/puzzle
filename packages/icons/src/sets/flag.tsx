import { Icon, type IconProps } from "../icon";
import type { FlagIconName } from "./flag.types.ts";

const prefix = "flag" as const;

type FlagIconProps = Omit<IconProps, "name"> & {
  name: FlagIconName;
};

const FlagIcon = ({ name, ...props }: FlagIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlagIcon, type FlagIconProps };
