import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GisIconName } from "./gis.types.ts";

const prefix = "gis" as const;

type SSRGisIconProps = Omit<SSRIconProps, "name"> & {
  name: GisIconName;
};

const GisIcon = ({ name, ...props }: SSRGisIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GisIcon, type SSRGisIconProps };
