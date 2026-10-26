import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CilIconName } from "./cil.types.ts";

const prefix = "cil" as const;

type SSRCilIconProps = Omit<SSRIconProps, "name"> & {
  name: CilIconName;
};

const CilIcon = ({ name, ...props }: SSRCilIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CilIcon, type SSRCilIconProps };
