import { Icon, type IconProps } from "../icon";
import type { Fa6RegularIconName } from "./fa6-regular.types.ts";

const prefix = "fa6-regular" as const;

type Fa6RegularIconProps = Omit<IconProps, "name"> & {
  name: Fa6RegularIconName;
};

const Fa6RegularIcon = ({ name, ...props }: Fa6RegularIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa6RegularIcon, type Fa6RegularIconProps };
