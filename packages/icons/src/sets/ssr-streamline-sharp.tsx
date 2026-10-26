import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineSharpIconName } from "./streamline-sharp.types.ts";

const prefix = "streamline-sharp" as const;

type SSRStreamlineSharpIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineSharpIconName;
};

const StreamlineSharpIcon = ({ name, ...props }: SSRStreamlineSharpIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineSharpIcon, type SSRStreamlineSharpIconProps };
