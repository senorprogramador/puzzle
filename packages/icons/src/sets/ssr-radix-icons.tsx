import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { RadixIconsIconName } from "./radix-icons.types.ts";

const prefix = "radix-icons" as const;

type SSRRadixIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: RadixIconsIconName;
};

const RadixIconsIcon = ({ name, ...props }: SSRRadixIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { RadixIconsIcon, type SSRRadixIconsIconProps };
