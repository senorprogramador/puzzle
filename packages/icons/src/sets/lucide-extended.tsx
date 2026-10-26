import { Icon, type IconProps } from "../icon";
import type { LucideExtendedIconName } from "./lucide-extended.types.ts";

const prefix = "lucide-extended" as const;

type LucideExtendedIconProps = Omit<IconProps, "name"> & {
  name: LucideExtendedIconName;
};

const LucideExtendedIcon = ({ name, ...props }: LucideExtendedIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LucideExtendedIcon, type LucideExtendedIconProps };
