import { Icon, type IconProps } from "../icon";
import type { StreamlinePlumpIconName } from "./streamline-plump.types.ts";

const prefix = "streamline-plump" as const;

type StreamlinePlumpIconProps = Omit<IconProps, "name"> & {
  name: StreamlinePlumpIconName;
};

const StreamlinePlumpIcon = ({ name, ...props }: StreamlinePlumpIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlinePlumpIcon, type StreamlinePlumpIconProps };
