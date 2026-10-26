import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LucideExtendedIconName } from "./lucide-extended.types.ts";

const prefix = "lucide-extended" as const;

type SSRLucideExtendedIconProps = Omit<SSRIconProps, "name"> & {
  name: LucideExtendedIconName;
};

const LucideExtendedIcon = ({ name, ...props }: SSRLucideExtendedIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LucideExtendedIcon, type SSRLucideExtendedIconProps };
