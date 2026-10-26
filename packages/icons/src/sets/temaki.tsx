import { Icon, type IconProps } from "../icon";
import type { TemakiIconName } from "./temaki.types.ts";

const prefix = "temaki" as const;

type TemakiIconProps = Omit<IconProps, "name"> & {
  name: TemakiIconName;
};

const TemakiIcon = ({ name, ...props }: TemakiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TemakiIcon, type TemakiIconProps };
