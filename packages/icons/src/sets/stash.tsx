import { Icon, type IconProps } from "../icon";
import type { StashIconName } from "./stash.types.ts";

const prefix = "stash" as const;

type StashIconProps = Omit<IconProps, "name"> & {
  name: StashIconName;
};

const StashIcon = ({ name, ...props }: StashIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StashIcon, type StashIconProps };
