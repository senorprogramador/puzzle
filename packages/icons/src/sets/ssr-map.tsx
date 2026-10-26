import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MapIconName } from "./map.types.ts";

const prefix = "map" as const;

type SSRMapIconProps = Omit<SSRIconProps, "name"> & {
  name: MapIconName;
};

const MapIcon = ({ name, ...props }: SSRMapIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MapIcon, type SSRMapIconProps };
