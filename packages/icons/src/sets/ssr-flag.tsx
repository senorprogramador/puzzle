import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FlagIconName } from "./flag.types.ts";

const prefix = "flag" as const;

type SSRFlagIconProps = Omit<SSRIconProps, "name"> & {
  name: FlagIconName;
};

const FlagIcon = ({ name, ...props }: SSRFlagIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlagIcon, type SSRFlagIconProps };
