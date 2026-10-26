import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LucideLabIconName } from "./lucide-lab.types.ts";

const prefix = "lucide-lab" as const;

type SSRLucideLabIconProps = Omit<SSRIconProps, "name"> & {
  name: LucideLabIconName;
};

const LucideLabIcon = ({ name, ...props }: SSRLucideLabIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LucideLabIcon, type SSRLucideLabIconProps };
