import { Icon, type IconProps } from "../icon";
import type { Fa7RegularIconName } from "./fa7-regular.types.ts";

const prefix = "fa7-regular" as const;

type Fa7RegularIconProps = Omit<IconProps, "name"> & {
  name: Fa7RegularIconName;
};

const Fa7RegularIcon = ({ name, ...props }: Fa7RegularIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa7RegularIcon, type Fa7RegularIconProps };
