import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GgIconName } from "./gg.types.ts";

const prefix = "gg" as const;

type SSRGgIconProps = Omit<SSRIconProps, "name"> & {
  name: GgIconName;
};

const GgIcon = ({ name, ...props }: SSRGgIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GgIcon, type SSRGgIconProps };
