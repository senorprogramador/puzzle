import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { UnjsIconName } from "./unjs.types.ts";

const prefix = "unjs" as const;

type SSRUnjsIconProps = Omit<SSRIconProps, "name"> & {
  name: UnjsIconName;
};

const UnjsIcon = ({ name, ...props }: SSRUnjsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { UnjsIcon, type SSRUnjsIconProps };
