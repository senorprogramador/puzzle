import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineFlexIconName } from "./streamline-flex.types.ts";

const prefix = "streamline-flex" as const;

type SSRStreamlineFlexIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineFlexIconName;
};

const StreamlineFlexIcon = ({ name, ...props }: SSRStreamlineFlexIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineFlexIcon, type SSRStreamlineFlexIconProps };
