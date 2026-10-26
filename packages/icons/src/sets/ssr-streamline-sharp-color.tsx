import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineSharpColorIconName } from "./streamline-sharp-color.types.ts";

const prefix = "streamline-sharp-color" as const;

type SSRStreamlineSharpColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineSharpColorIconName;
};

const StreamlineSharpColorIcon = ({ name, ...props }: SSRStreamlineSharpColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineSharpColorIcon, type SSRStreamlineSharpColorIconProps };
