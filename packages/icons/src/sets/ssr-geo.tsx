import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GeoIconName } from "./geo.types.ts";

const prefix = "geo" as const;

type SSRGeoIconProps = Omit<SSRIconProps, "name"> & {
  name: GeoIconName;
};

const GeoIcon = ({ name, ...props }: SSRGeoIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GeoIcon, type SSRGeoIconProps };
