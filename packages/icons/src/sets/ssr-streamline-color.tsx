import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineColorIconName } from "./streamline-color.types.ts";

const prefix = "streamline-color" as const;

type SSRStreamlineColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineColorIconName;
};

const StreamlineColorIcon = ({ name, ...props }: SSRStreamlineColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineColorIcon, type SSRStreamlineColorIconProps };
