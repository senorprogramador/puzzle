import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { VsIconName } from "./vs.types.ts";

const prefix = "vs" as const;

type SSRVsIconProps = Omit<SSRIconProps, "name"> & {
  name: VsIconName;
};

const VsIcon = ({ name, ...props }: SSRVsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { VsIcon, type SSRVsIconProps };
