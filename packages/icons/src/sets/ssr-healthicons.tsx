import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { HealthiconsIconName } from "./healthicons.types.ts";

const prefix = "healthicons" as const;

type SSRHealthiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: HealthiconsIconName;
};

const HealthiconsIcon = ({ name, ...props }: SSRHealthiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { HealthiconsIcon, type SSRHealthiconsIconProps };
