import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LsiconIconName } from "./lsicon.types.ts";

const prefix = "lsicon" as const;

type SSRLsiconIconProps = Omit<SSRIconProps, "name"> & {
  name: LsiconIconName;
};

const LsiconIcon = ({ name, ...props }: SSRLsiconIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LsiconIcon, type SSRLsiconIconProps };
