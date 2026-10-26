import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EiIconName } from "./ei.types.ts";

const prefix = "ei" as const;

type SSREiIconProps = Omit<SSRIconProps, "name"> & {
  name: EiIconName;
};

const EiIcon = ({ name, ...props }: SSREiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EiIcon, type SSREiIconProps };
