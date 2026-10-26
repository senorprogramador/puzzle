import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GcpIconName } from "./gcp.types.ts";

const prefix = "gcp" as const;

type SSRGcpIconProps = Omit<SSRIconProps, "name"> & {
  name: GcpIconName;
};

const GcpIcon = ({ name, ...props }: SSRGcpIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GcpIcon, type SSRGcpIconProps };
