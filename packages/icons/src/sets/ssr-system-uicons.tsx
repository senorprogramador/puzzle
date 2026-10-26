import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SystemUiconsIconName } from "./system-uicons.types.ts";

const prefix = "system-uicons" as const;

type SSRSystemUiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: SystemUiconsIconName;
};

const SystemUiconsIcon = ({ name, ...props }: SSRSystemUiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SystemUiconsIcon, type SSRSystemUiconsIconProps };
