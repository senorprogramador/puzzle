import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MiIconName } from "./mi.types.ts";

const prefix = "mi" as const;

type SSRMiIconProps = Omit<SSRIconProps, "name"> & {
  name: MiIconName;
};

const MiIcon = ({ name, ...props }: SSRMiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MiIcon, type SSRMiIconProps };
