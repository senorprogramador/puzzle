import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PixelIconName } from "./pixel.types.ts";

const prefix = "pixel" as const;

type SSRPixelIconProps = Omit<SSRIconProps, "name"> & {
  name: PixelIconName;
};

const PixelIcon = ({ name, ...props }: SSRPixelIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PixelIcon, type SSRPixelIconProps };
