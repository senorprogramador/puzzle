import { Icon, type IconProps } from "../icon";
import type { StreamlineFlexIconName } from "./streamline-flex.types.ts";

const prefix = "streamline-flex" as const;

type StreamlineFlexIconProps = Omit<IconProps, "name"> & {
  name: StreamlineFlexIconName;
};

const StreamlineFlexIcon = ({ name, ...props }: StreamlineFlexIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineFlexIcon, type StreamlineFlexIconProps };
