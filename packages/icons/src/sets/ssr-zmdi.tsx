import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ZmdiIconName } from "./zmdi.types.ts";

const prefix = "zmdi" as const;

type SSRZmdiIconProps = Omit<SSRIconProps, "name"> & {
  name: ZmdiIconName;
};

const ZmdiIcon = ({ name, ...props }: SSRZmdiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ZmdiIcon, type SSRZmdiIconProps };
