import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FeatherIconName } from "./feather.types.ts";

const prefix = "feather" as const;

type SSRFeatherIconProps = Omit<SSRIconProps, "name"> & {
  name: FeatherIconName;
};

const FeatherIcon = ({ name, ...props }: SSRFeatherIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FeatherIcon, type SSRFeatherIconProps };
