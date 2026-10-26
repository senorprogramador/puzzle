import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineLogosIconName } from "./streamline-logos.types.ts";

const prefix = "streamline-logos" as const;

type SSRStreamlineLogosIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineLogosIconName;
};

const StreamlineLogosIcon = ({ name, ...props }: SSRStreamlineLogosIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineLogosIcon, type SSRStreamlineLogosIconProps };
