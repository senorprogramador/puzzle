import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LaIconName } from "./la.types.ts";

const prefix = "la" as const;

type SSRLaIconProps = Omit<SSRIconProps, "name"> & {
  name: LaIconName;
};

const LaIcon = ({ name, ...props }: SSRLaIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LaIcon, type SSRLaIconProps };
