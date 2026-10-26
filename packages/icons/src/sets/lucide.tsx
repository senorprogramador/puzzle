import { Icon, type IconProps } from "../icon";
import type { LucideIconName } from "./lucide.types.ts";

const prefix = "lucide" as const;

type LucideIconProps = Omit<IconProps, "name"> & {
  name: LucideIconName;
};

const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LucideIcon, type LucideIconProps };
