import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BiIconName } from "./bi.types.ts";

const prefix = "bi" as const;

type SSRBiIconProps = Omit<SSRIconProps, "name"> & {
  name: BiIconName;
};

const BiIcon = ({ name, ...props }: SSRBiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BiIcon, type SSRBiIconProps };
