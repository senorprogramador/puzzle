import { Icon, type IconProps } from "../icon";
import type { PixelIconName } from "./pixel.types.ts";

const prefix = "pixel" as const;

type PixelIconProps = Omit<IconProps, "name"> & {
  name: PixelIconName;
};

const PixelIcon = ({ name, ...props }: PixelIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PixelIcon, type PixelIconProps };
