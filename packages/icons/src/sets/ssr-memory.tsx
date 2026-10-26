import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MemoryIconName } from "./memory.types.ts";

const prefix = "memory" as const;

type SSRMemoryIconProps = Omit<SSRIconProps, "name"> & {
  name: MemoryIconName;
};

const MemoryIcon = ({ name, ...props }: SSRMemoryIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MemoryIcon, type SSRMemoryIconProps };
