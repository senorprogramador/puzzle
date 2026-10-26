import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineStickiesColorIconName } from "./streamline-stickies-color.types.ts";

const prefix = "streamline-stickies-color" as const;

type SSRStreamlineStickiesColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineStickiesColorIconName;
};

const StreamlineStickiesColorIcon = ({ name, ...props }: SSRStreamlineStickiesColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineStickiesColorIcon, type SSRStreamlineStickiesColorIconProps };
