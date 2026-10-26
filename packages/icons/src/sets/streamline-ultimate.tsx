import { Icon, type IconProps } from "../icon";
import type { StreamlineUltimateIconName } from "./streamline-ultimate.types.ts";

const prefix = "streamline-ultimate" as const;

type StreamlineUltimateIconProps = Omit<IconProps, "name"> & {
  name: StreamlineUltimateIconName;
};

const StreamlineUltimateIcon = ({ name, ...props }: StreamlineUltimateIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineUltimateIcon, type StreamlineUltimateIconProps };
