import { Icon, type IconProps } from "../icon";
import type { StreamlineSharpIconName } from "./streamline-sharp.types.ts";

const prefix = "streamline-sharp" as const;

type StreamlineSharpIconProps = Omit<IconProps, "name"> & {
  name: StreamlineSharpIconName;
};

const StreamlineSharpIcon = ({ name, ...props }: StreamlineSharpIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineSharpIcon, type StreamlineSharpIconProps };
