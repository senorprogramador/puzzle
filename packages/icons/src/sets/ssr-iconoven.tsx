import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IconovenIconName } from "./iconoven.types.ts";

const prefix = "iconoven" as const;

type SSRIconovenIconProps = Omit<SSRIconProps, "name"> & {
  name: IconovenIconName;
};

const IconovenIcon = ({ name, ...props }: SSRIconovenIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconovenIcon, type SSRIconovenIconProps };
