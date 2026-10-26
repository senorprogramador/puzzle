import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BxIconName } from "./bx.types.ts";

const prefix = "bx" as const;

type SSRBxIconProps = Omit<SSRIconProps, "name"> & {
  name: BxIconName;
};

const BxIcon = ({ name, ...props }: SSRBxIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BxIcon, type SSRBxIconProps };
