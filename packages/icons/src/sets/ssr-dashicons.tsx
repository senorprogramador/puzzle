import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { DashiconsIconName } from "./dashicons.types.ts";

const prefix = "dashicons" as const;

type SSRDashiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: DashiconsIconName;
};

const DashiconsIcon = ({ name, ...props }: SSRDashiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { DashiconsIcon, type SSRDashiconsIconProps };
