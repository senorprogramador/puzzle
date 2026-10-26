import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ProiconsIconName } from "./proicons.types.ts";

const prefix = "proicons" as const;

type SSRProiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: ProiconsIconName;
};

const ProiconsIcon = ({ name, ...props }: SSRProiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ProiconsIcon, type SSRProiconsIconProps };
