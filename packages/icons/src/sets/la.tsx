import { Icon, type IconProps } from "../icon";
import type { LaIconName } from "./la.types.ts";

const prefix = "la" as const;

type LaIconProps = Omit<IconProps, "name"> & {
  name: LaIconName;
};

const LaIcon = ({ name, ...props }: LaIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LaIcon, type LaIconProps };
