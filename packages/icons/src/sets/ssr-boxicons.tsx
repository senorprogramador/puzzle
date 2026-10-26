import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BoxiconsIconName } from "./boxicons.types.ts";

const prefix = "boxicons" as const;

type SSRBoxiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: BoxiconsIconName;
};

const BoxiconsIcon = ({ name, ...props }: SSRBoxiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BoxiconsIcon, type SSRBoxiconsIconProps };
