import { Icon, type IconProps } from "../icon";
import type { MapIconName } from "./map.types.ts";

const prefix = "map" as const;

type MapIconProps = Omit<IconProps, "name"> & {
  name: MapIconName;
};

const MapIcon = ({ name, ...props }: MapIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MapIcon, type MapIconProps };
