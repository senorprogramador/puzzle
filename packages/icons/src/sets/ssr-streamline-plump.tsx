import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlinePlumpIconName } from "./streamline-plump.types.ts";

const prefix = "streamline-plump" as const;

type SSRStreamlinePlumpIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlinePlumpIconName;
};

const StreamlinePlumpIcon = ({ name, ...props }: SSRStreamlinePlumpIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlinePlumpIcon, type SSRStreamlinePlumpIconProps };
