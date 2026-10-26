import { Icon, type IconProps } from "../icon";
import type { ThesvgColorIconName } from "./thesvg-color.types.ts";

const prefix = "thesvg-color" as const;

type ThesvgColorIconProps = Omit<IconProps, "name"> & {
  name: ThesvgColorIconName;
};

const ThesvgColorIcon = ({ name, ...props }: ThesvgColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ThesvgColorIcon, type ThesvgColorIconProps };
