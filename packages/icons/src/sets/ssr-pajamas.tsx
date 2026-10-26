import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PajamasIconName } from "./pajamas.types.ts";

const prefix = "pajamas" as const;

type SSRPajamasIconProps = Omit<SSRIconProps, "name"> & {
  name: PajamasIconName;
};

const PajamasIcon = ({ name, ...props }: SSRPajamasIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PajamasIcon, type SSRPajamasIconProps };
