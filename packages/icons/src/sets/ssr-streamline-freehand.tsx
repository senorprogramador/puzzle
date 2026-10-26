import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineFreehandIconName } from "./streamline-freehand.types.ts";

const prefix = "streamline-freehand" as const;

type SSRStreamlineFreehandIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineFreehandIconName;
};

const StreamlineFreehandIcon = ({ name, ...props }: SSRStreamlineFreehandIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineFreehandIcon, type SSRStreamlineFreehandIconProps };
