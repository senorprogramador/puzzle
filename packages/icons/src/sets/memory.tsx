import { Icon, type IconProps } from "../icon";
import type { MemoryIconName } from "./memory.types.ts";

const prefix = "memory" as const;

type MemoryIconProps = Omit<IconProps, "name"> & {
  name: MemoryIconName;
};

const MemoryIcon = ({ name, ...props }: MemoryIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MemoryIcon, type MemoryIconProps };
