import { Icon, type IconProps } from "../icon";
import type { FeatherIconName } from "./feather.types.ts";

const prefix = "feather" as const;

type FeatherIconProps = Omit<IconProps, "name"> & {
  name: FeatherIconName;
};

const FeatherIcon = ({ name, ...props }: FeatherIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FeatherIcon, type FeatherIconProps };
