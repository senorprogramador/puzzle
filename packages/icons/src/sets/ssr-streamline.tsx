import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineIconName } from "./streamline.types.ts";

const prefix = "streamline" as const;

type SSRStreamlineIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineIconName;
};

const StreamlineIcon = ({ name, ...props }: SSRStreamlineIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineIcon, type SSRStreamlineIconProps };
