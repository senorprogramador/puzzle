import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PiconIconName } from "./picon.types.ts";

const prefix = "picon" as const;

type SSRPiconIconProps = Omit<SSRIconProps, "name"> & {
  name: PiconIconName;
};

const PiconIcon = ({ name, ...props }: SSRPiconIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PiconIcon, type SSRPiconIconProps };
