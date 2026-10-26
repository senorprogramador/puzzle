import { Icon, type IconProps } from "../icon";
import type { StreamlineLogosIconName } from "./streamline-logos.types.ts";

const prefix = "streamline-logos" as const;

type StreamlineLogosIconProps = Omit<IconProps, "name"> & {
  name: StreamlineLogosIconName;
};

const StreamlineLogosIcon = ({ name, ...props }: StreamlineLogosIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineLogosIcon, type StreamlineLogosIconProps };
