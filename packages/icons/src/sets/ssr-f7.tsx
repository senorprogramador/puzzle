import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { F7IconName } from "./f7.types.ts";

const prefix = "f7" as const;

type SSRF7IconProps = Omit<SSRIconProps, "name"> & {
  name: F7IconName;
};

const F7Icon = ({ name, ...props }: SSRF7IconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { F7Icon, type SSRF7IconProps };
