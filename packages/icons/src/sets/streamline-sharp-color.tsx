import { Icon, type IconProps } from "../icon";
import type { StreamlineSharpColorIconName } from "./streamline-sharp-color.types.ts";

const prefix = "streamline-sharp-color" as const;

type StreamlineSharpColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlineSharpColorIconName;
};

const StreamlineSharpColorIcon = ({ name, ...props }: StreamlineSharpColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineSharpColorIcon, type StreamlineSharpColorIconProps };
