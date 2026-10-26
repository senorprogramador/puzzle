import { Icon, type IconProps } from "../icon";
import type { F7IconName } from "./f7.types.ts";

const prefix = "f7" as const;

type F7IconProps = Omit<IconProps, "name"> & {
  name: F7IconName;
};

const F7Icon = ({ name, ...props }: F7IconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { F7Icon, type F7IconProps };
