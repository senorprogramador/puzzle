import { Icon, type IconProps } from "../icon";
import type { StreamlineUltimateColorIconName } from "./streamline-ultimate-color.types.ts";

const prefix = "streamline-ultimate-color" as const;

type StreamlineUltimateColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlineUltimateColorIconName;
};

const StreamlineUltimateColorIcon = ({ name, ...props }: StreamlineUltimateColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineUltimateColorIcon, type StreamlineUltimateColorIconProps };
