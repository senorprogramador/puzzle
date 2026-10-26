import { Icon, type IconProps } from "../icon";
import type { StreamlineBlockIconName } from "./streamline-block.types.ts";

const prefix = "streamline-block" as const;

type StreamlineBlockIconProps = Omit<IconProps, "name"> & {
  name: StreamlineBlockIconName;
};

const StreamlineBlockIcon = ({ name, ...props }: StreamlineBlockIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineBlockIcon, type StreamlineBlockIconProps };
