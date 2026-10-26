import { Icon, type IconProps } from "../icon";
import type { RiIconName } from "./ri.types.ts";

const prefix = "ri" as const;

type RiIconProps = Omit<IconProps, "name"> & {
  name: RiIconName;
};

const RiIcon = ({ name, ...props }: RiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { RiIcon, type RiIconProps };
