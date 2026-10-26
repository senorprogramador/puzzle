import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { OouiIconName } from "./ooui.types.ts";

const prefix = "ooui" as const;

type SSROouiIconProps = Omit<SSRIconProps, "name"> & {
  name: OouiIconName;
};

const OouiIcon = ({ name, ...props }: SSROouiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { OouiIcon, type SSROouiIconProps };
