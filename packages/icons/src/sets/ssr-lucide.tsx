import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LucideIconName } from "./lucide.types.ts";

const prefix = "lucide" as const;

type SSRLucideIconProps = Omit<SSRIconProps, "name"> & {
  name: LucideIconName;
};

const LucideIcon = ({ name, ...props }: SSRLucideIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LucideIcon, type SSRLucideIconProps };
