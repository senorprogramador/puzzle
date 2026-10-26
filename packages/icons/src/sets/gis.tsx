import { Icon, type IconProps } from "../icon";
import type { GisIconName } from "./gis.types.ts";

const prefix = "gis" as const;

type GisIconProps = Omit<IconProps, "name"> & {
  name: GisIconName;
};

const GisIcon = ({ name, ...props }: GisIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GisIcon, type GisIconProps };
