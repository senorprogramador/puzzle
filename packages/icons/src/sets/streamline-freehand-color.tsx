import { Icon, type IconProps } from "../icon";
import type { StreamlineFreehandColorIconName } from "./streamline-freehand-color.types.ts";

const prefix = "streamline-freehand-color" as const;

type StreamlineFreehandColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlineFreehandColorIconName;
};

const StreamlineFreehandColorIcon = ({ name, ...props }: StreamlineFreehandColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineFreehandColorIcon, type StreamlineFreehandColorIconProps };
