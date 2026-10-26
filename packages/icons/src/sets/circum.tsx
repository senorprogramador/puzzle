import { Icon, type IconProps } from "../icon";
import type { CircumIconName } from "./circum.types.ts";

const prefix = "circum" as const;

type CircumIconProps = Omit<IconProps, "name"> & {
  name: CircumIconName;
};

const CircumIcon = ({ name, ...props }: CircumIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CircumIcon, type CircumIconProps };
