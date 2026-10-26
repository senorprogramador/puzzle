import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BxsIconName } from "./bxs.types.ts";

const prefix = "bxs" as const;

type SSRBxsIconProps = Omit<SSRIconProps, "name"> & {
  name: BxsIconName;
};

const BxsIcon = ({ name, ...props }: SSRBxsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BxsIcon, type SSRBxsIconProps };
