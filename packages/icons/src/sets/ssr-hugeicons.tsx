import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { HugeiconsIconName } from "./hugeicons.types.ts";

const prefix = "hugeicons" as const;

type SSRHugeiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: HugeiconsIconName;
};

const HugeiconsIcon = ({ name, ...props }: SSRHugeiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { HugeiconsIcon, type SSRHugeiconsIconProps };
