import { Icon, type IconProps } from "../icon";
import type { LucideLabIconName } from "./lucide-lab.types.ts";

const prefix = "lucide-lab" as const;

type LucideLabIconProps = Omit<IconProps, "name"> & {
  name: LucideLabIconName;
};

const LucideLabIcon = ({ name, ...props }: LucideLabIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LucideLabIcon, type LucideLabIconProps };
