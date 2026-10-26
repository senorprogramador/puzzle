import { Icon, type IconProps } from "../icon";
import type { ThesvgIconName } from "./thesvg.types.ts";

const prefix = "thesvg" as const;

type ThesvgIconProps = Omit<IconProps, "name"> & {
  name: ThesvgIconName;
};

const ThesvgIcon = ({ name, ...props }: ThesvgIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ThesvgIcon, type ThesvgIconProps };
