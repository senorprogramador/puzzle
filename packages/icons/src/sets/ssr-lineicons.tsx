import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LineiconsIconName } from "./lineicons.types.ts";

const prefix = "lineicons" as const;

type SSRLineiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: LineiconsIconName;
};

const LineiconsIcon = ({ name, ...props }: SSRLineiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LineiconsIcon, type SSRLineiconsIconProps };
