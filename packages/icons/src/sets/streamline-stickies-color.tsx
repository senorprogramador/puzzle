import { Icon, type IconProps } from "../icon";
import type { StreamlineStickiesColorIconName } from "./streamline-stickies-color.types.ts";

const prefix = "streamline-stickies-color" as const;

type StreamlineStickiesColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlineStickiesColorIconName;
};

const StreamlineStickiesColorIcon = ({ name, ...props }: StreamlineStickiesColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineStickiesColorIcon, type StreamlineStickiesColorIconProps };
