import { Icon, type IconProps } from "../icon";
import type { GardenIconName } from "./garden.types.ts";

const prefix = "garden" as const;

type GardenIconProps = Omit<IconProps, "name"> & {
  name: GardenIconName;
};

const GardenIcon = ({ name, ...props }: GardenIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GardenIcon, type GardenIconProps };
