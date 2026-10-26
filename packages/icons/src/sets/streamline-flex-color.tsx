import { Icon, type IconProps } from "../icon";
import type { StreamlineFlexColorIconName } from "./streamline-flex-color.types.ts";

const prefix = "streamline-flex-color" as const;

type StreamlineFlexColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlineFlexColorIconName;
};

const StreamlineFlexColorIcon = ({ name, ...props }: StreamlineFlexColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineFlexColorIcon, type StreamlineFlexColorIconProps };
