import { Icon, type IconProps } from "../icon";
import type { LsiconIconName } from "./lsicon.types.ts";

const prefix = "lsicon" as const;

type LsiconIconProps = Omit<IconProps, "name"> & {
  name: LsiconIconName;
};

const LsiconIcon = ({ name, ...props }: LsiconIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LsiconIcon, type LsiconIconProps };
