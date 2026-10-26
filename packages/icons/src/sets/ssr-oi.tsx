import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { OiIconName } from "./oi.types.ts";

const prefix = "oi" as const;

type SSROiIconProps = Omit<SSRIconProps, "name"> & {
  name: OiIconName;
};

const OiIcon = ({ name, ...props }: SSROiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { OiIcon, type SSROiIconProps };
