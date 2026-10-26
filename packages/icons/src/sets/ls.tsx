import { Icon, type IconProps } from "../icon";
import type { LsIconName } from "./ls.types.ts";

const prefix = "ls" as const;

type LsIconProps = Omit<IconProps, "name"> & {
  name: LsIconName;
};

const LsIcon = ({ name, ...props }: LsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LsIcon, type LsIconProps };
