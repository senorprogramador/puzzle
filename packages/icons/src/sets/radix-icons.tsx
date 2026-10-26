import { Icon, type IconProps } from "../icon";
import type { RadixIconsIconName } from "./radix-icons.types.ts";

const prefix = "radix-icons" as const;

type RadixIconsIconProps = Omit<IconProps, "name"> & {
  name: RadixIconsIconName;
};

const RadixIconsIcon = ({ name, ...props }: RadixIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { RadixIconsIcon, type RadixIconsIconProps };
