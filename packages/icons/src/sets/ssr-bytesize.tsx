import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BytesizeIconName } from "./bytesize.types.ts";

const prefix = "bytesize" as const;

type SSRBytesizeIconProps = Omit<SSRIconProps, "name"> & {
  name: BytesizeIconName;
};

const BytesizeIcon = ({ name, ...props }: SSRBytesizeIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BytesizeIcon, type SSRBytesizeIconProps };
