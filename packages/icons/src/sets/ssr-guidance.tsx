import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GuidanceIconName } from "./guidance.types.ts";

const prefix = "guidance" as const;

type SSRGuidanceIconProps = Omit<SSRIconProps, "name"> & {
  name: GuidanceIconName;
};

const GuidanceIcon = ({ name, ...props }: SSRGuidanceIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GuidanceIcon, type SSRGuidanceIconProps };
