import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CbiIconName } from "./cbi.types.ts";

const prefix = "cbi" as const;

type SSRCbiIconProps = Omit<SSRIconProps, "name"> & {
  name: CbiIconName;
};

const CbiIcon = ({ name, ...props }: SSRCbiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CbiIcon, type SSRCbiIconProps };
