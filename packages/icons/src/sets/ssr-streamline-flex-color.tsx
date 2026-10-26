import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineFlexColorIconName } from "./streamline-flex-color.types.ts";

const prefix = "streamline-flex-color" as const;

type SSRStreamlineFlexColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineFlexColorIconName;
};

const StreamlineFlexColorIcon = ({ name, ...props }: SSRStreamlineFlexColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineFlexColorIcon, type SSRStreamlineFlexColorIconProps };
