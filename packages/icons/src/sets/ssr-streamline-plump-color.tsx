import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlinePlumpColorIconName } from "./streamline-plump-color.types.ts";

const prefix = "streamline-plump-color" as const;

type SSRStreamlinePlumpColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlinePlumpColorIconName;
};

const StreamlinePlumpColorIcon = ({ name, ...props }: SSRStreamlinePlumpColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlinePlumpColorIcon, type SSRStreamlinePlumpColorIconProps };
