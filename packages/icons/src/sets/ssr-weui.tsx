import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { WeuiIconName } from "./weui.types.ts";

const prefix = "weui" as const;

type SSRWeuiIconProps = Omit<SSRIconProps, "name"> & {
  name: WeuiIconName;
};

const WeuiIcon = ({ name, ...props }: SSRWeuiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { WeuiIcon, type SSRWeuiIconProps };
