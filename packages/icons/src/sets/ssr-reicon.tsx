import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ReiconIconName } from "./reicon.types.ts";

const prefix = "reicon" as const;

type SSRReiconIconProps = Omit<SSRIconProps, "name"> & {
  name: ReiconIconName;
};

const ReiconIcon = ({ name, ...props }: SSRReiconIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ReiconIcon, type SSRReiconIconProps };
