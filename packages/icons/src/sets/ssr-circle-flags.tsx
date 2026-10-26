import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CircleFlagsIconName } from "./circle-flags.types.ts";

const prefix = "circle-flags" as const;

type SSRCircleFlagsIconProps = Omit<SSRIconProps, "name"> & {
  name: CircleFlagsIconName;
};

const CircleFlagsIcon = ({ name, ...props }: SSRCircleFlagsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CircleFlagsIcon, type SSRCircleFlagsIconProps };
