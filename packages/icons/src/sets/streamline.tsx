import { Icon, type IconProps } from "../icon";
import type { StreamlineIconName } from "./streamline.types.ts";

const prefix = "streamline" as const;

type StreamlineIconProps = Omit<IconProps, "name"> & {
  name: StreamlineIconName;
};

const StreamlineIcon = ({ name, ...props }: StreamlineIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineIcon, type StreamlineIconProps };
