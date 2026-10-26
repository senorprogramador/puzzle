import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LsIconName } from "./ls.types.ts";

const prefix = "ls" as const;

type SSRLsIconProps = Omit<SSRIconProps, "name"> & {
  name: LsIconName;
};

const LsIcon = ({ name, ...props }: SSRLsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LsIcon, type SSRLsIconProps };
