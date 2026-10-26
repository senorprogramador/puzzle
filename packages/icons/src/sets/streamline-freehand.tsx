import { Icon, type IconProps } from "../icon";
import type { StreamlineFreehandIconName } from "./streamline-freehand.types.ts";

const prefix = "streamline-freehand" as const;

type StreamlineFreehandIconProps = Omit<IconProps, "name"> & {
  name: StreamlineFreehandIconName;
};

const StreamlineFreehandIcon = ({ name, ...props }: StreamlineFreehandIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineFreehandIcon, type StreamlineFreehandIconProps };
