import { Icon, type IconProps } from "../icon";
import type { IconamoonIconName } from "./iconamoon.types.ts";

const prefix = "iconamoon" as const;

type IconamoonIconProps = Omit<IconProps, "name"> & {
  name: IconamoonIconName;
};

const IconamoonIcon = ({ name, ...props }: IconamoonIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconamoonIcon, type IconamoonIconProps };
