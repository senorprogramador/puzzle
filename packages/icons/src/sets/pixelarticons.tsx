import { Icon, type IconProps } from "../icon";
import type { PixelarticonsIconName } from "./pixelarticons.types.ts";

const prefix = "pixelarticons" as const;

type PixelarticonsIconProps = Omit<IconProps, "name"> & {
  name: PixelarticonsIconName;
};

const PixelarticonsIcon = ({ name, ...props }: PixelarticonsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PixelarticonsIcon, type PixelarticonsIconProps };
