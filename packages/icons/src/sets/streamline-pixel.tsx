import { Icon, type IconProps } from "../icon";
import type { StreamlinePixelIconName } from "./streamline-pixel.types.ts";

const prefix = "streamline-pixel" as const;

type StreamlinePixelIconProps = Omit<IconProps, "name"> & {
  name: StreamlinePixelIconName;
};

const StreamlinePixelIcon = ({ name, ...props }: StreamlinePixelIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlinePixelIcon, type StreamlinePixelIconProps };
