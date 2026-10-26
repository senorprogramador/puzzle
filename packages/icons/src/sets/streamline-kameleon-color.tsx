import { Icon, type IconProps } from "../icon";
import type { StreamlineKameleonColorIconName } from "./streamline-kameleon-color.types.ts";

const prefix = "streamline-kameleon-color" as const;

type StreamlineKameleonColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlineKameleonColorIconName;
};

const StreamlineKameleonColorIcon = ({ name, ...props }: StreamlineKameleonColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineKameleonColorIcon, type StreamlineKameleonColorIconProps };
