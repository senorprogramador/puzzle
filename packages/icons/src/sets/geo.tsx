import { Icon, type IconProps } from "../icon";
import type { GeoIconName } from "./geo.types.ts";

const prefix = "geo" as const;

type GeoIconProps = Omit<IconProps, "name"> & {
  name: GeoIconName;
};

const GeoIcon = ({ name, ...props }: GeoIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GeoIcon, type GeoIconProps };
