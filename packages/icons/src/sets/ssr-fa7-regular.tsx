import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { Fa7RegularIconName } from "./fa7-regular.types.ts";

const prefix = "fa7-regular" as const;

type SSRFa7RegularIconProps = Omit<SSRIconProps, "name"> & {
  name: Fa7RegularIconName;
};

const Fa7RegularIcon = ({ name, ...props }: SSRFa7RegularIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa7RegularIcon, type SSRFa7RegularIconProps };
