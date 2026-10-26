import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PepiconsIconName } from "./pepicons.types.ts";

const prefix = "pepicons" as const;

type SSRPepiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: PepiconsIconName;
};

const PepiconsIcon = ({ name, ...props }: SSRPepiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PepiconsIcon, type SSRPepiconsIconProps };
