import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineFreehandColorIconName } from "./streamline-freehand-color.types.ts";

const prefix = "streamline-freehand-color" as const;

type SSRStreamlineFreehandColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineFreehandColorIconName;
};

const StreamlineFreehandColorIcon = ({ name, ...props }: SSRStreamlineFreehandColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineFreehandColorIcon, type SSRStreamlineFreehandColorIconProps };
