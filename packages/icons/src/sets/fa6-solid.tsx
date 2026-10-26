import { Icon, type IconProps } from "../icon";
import type { Fa6SolidIconName } from "./fa6-solid.types.ts";

const prefix = "fa6-solid" as const;

type Fa6SolidIconProps = Omit<IconProps, "name"> & {
  name: Fa6SolidIconName;
};

const Fa6SolidIcon = ({ name, ...props }: Fa6SolidIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa6SolidIcon, type Fa6SolidIconProps };
