import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PepiconsPopIconName } from "./pepicons-pop.types.ts";

const prefix = "pepicons-pop" as const;

type SSRPepiconsPopIconProps = Omit<SSRIconProps, "name"> & {
  name: PepiconsPopIconName;
};

const PepiconsPopIcon = ({ name, ...props }: SSRPepiconsPopIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PepiconsPopIcon, type SSRPepiconsPopIconProps };
