import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlinePixelIconName } from "./streamline-pixel.types.ts";

const prefix = "streamline-pixel" as const;

type SSRStreamlinePixelIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlinePixelIconName;
};

const StreamlinePixelIcon = ({ name, ...props }: SSRStreamlinePixelIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlinePixelIcon, type SSRStreamlinePixelIconProps };
