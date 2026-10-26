import { Icon, type IconProps } from "../icon";
import type { StreamlineColorIconName } from "./streamline-color.types.ts";

const prefix = "streamline-color" as const;

type StreamlineColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlineColorIconName;
};

const StreamlineColorIcon = ({ name, ...props }: StreamlineColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineColorIcon, type StreamlineColorIconProps };
