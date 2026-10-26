import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PsIconName } from "./ps.types.ts";

const prefix = "ps" as const;

type SSRPsIconProps = Omit<SSRIconProps, "name"> & {
  name: PsIconName;
};

const PsIcon = ({ name, ...props }: SSRPsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PsIcon, type SSRPsIconProps };
