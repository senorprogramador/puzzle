import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineBlockIconName } from "./streamline-block.types.ts";

const prefix = "streamline-block" as const;

type SSRStreamlineBlockIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineBlockIconName;
};

const StreamlineBlockIcon = ({ name, ...props }: SSRStreamlineBlockIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineBlockIcon, type SSRStreamlineBlockIconProps };
