import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GardenIconName } from "./garden.types.ts";

const prefix = "garden" as const;

type SSRGardenIconProps = Omit<SSRIconProps, "name"> & {
  name: GardenIconName;
};

const GardenIcon = ({ name, ...props }: SSRGardenIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GardenIcon, type SSRGardenIconProps };
