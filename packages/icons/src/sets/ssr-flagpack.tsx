import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FlagpackIconName } from "./flagpack.types.ts";

const prefix = "flagpack" as const;

type SSRFlagpackIconProps = Omit<SSRIconProps, "name"> & {
  name: FlagpackIconName;
};

const FlagpackIcon = ({ name, ...props }: SSRFlagpackIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlagpackIcon, type SSRFlagpackIconProps };
