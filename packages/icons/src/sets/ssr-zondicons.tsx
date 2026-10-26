import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ZondiconsIconName } from "./zondicons.types.ts";

const prefix = "zondicons" as const;

type SSRZondiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: ZondiconsIconName;
};

const ZondiconsIcon = ({ name, ...props }: SSRZondiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ZondiconsIcon, type SSRZondiconsIconProps };
