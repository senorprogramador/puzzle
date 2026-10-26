import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineUltimateColorIconName } from "./streamline-ultimate-color.types.ts";

const prefix = "streamline-ultimate-color" as const;

type SSRStreamlineUltimateColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineUltimateColorIconName;
};

const StreamlineUltimateColorIcon = ({ name, ...props }: SSRStreamlineUltimateColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineUltimateColorIcon, type SSRStreamlineUltimateColorIconProps };
