import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EtIconName } from "./et.types.ts";

const prefix = "et" as const;

type SSREtIconProps = Omit<SSRIconProps, "name"> & {
  name: EtIconName;
};

const EtIcon = ({ name, ...props }: SSREtIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EtIcon, type SSREtIconProps };
