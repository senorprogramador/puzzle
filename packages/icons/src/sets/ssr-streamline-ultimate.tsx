import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineUltimateIconName } from "./streamline-ultimate.types.ts";

const prefix = "streamline-ultimate" as const;

type SSRStreamlineUltimateIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineUltimateIconName;
};

const StreamlineUltimateIcon = ({ name, ...props }: SSRStreamlineUltimateIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineUltimateIcon, type SSRStreamlineUltimateIconProps };
