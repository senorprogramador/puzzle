import { Icon, type IconProps } from "../icon";
import type { StreamlinePlumpColorIconName } from "./streamline-plump-color.types.ts";

const prefix = "streamline-plump-color" as const;

type StreamlinePlumpColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlinePlumpColorIconName;
};

const StreamlinePlumpColorIcon = ({ name, ...props }: StreamlinePlumpColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlinePlumpColorIcon, type StreamlinePlumpColorIconProps };
