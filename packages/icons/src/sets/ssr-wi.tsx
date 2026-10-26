import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { WiIconName } from "./wi.types.ts";

const prefix = "wi" as const;

type SSRWiIconProps = Omit<SSRIconProps, "name"> & {
  name: WiIconName;
};

const WiIcon = ({ name, ...props }: SSRWiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { WiIcon, type SSRWiIconProps };
