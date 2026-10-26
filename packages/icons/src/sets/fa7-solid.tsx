import { Icon, type IconProps } from "../icon";
import type { Fa7SolidIconName } from "./fa7-solid.types.ts";

const prefix = "fa7-solid" as const;

type Fa7SolidIconProps = Omit<IconProps, "name"> & {
  name: Fa7SolidIconName;
};

const Fa7SolidIcon = ({ name, ...props }: Fa7SolidIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa7SolidIcon, type Fa7SolidIconProps };
