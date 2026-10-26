import { Icon, type IconProps } from "../icon";
import type { LineiconsIconName } from "./lineicons.types.ts";

const prefix = "lineicons" as const;

type LineiconsIconProps = Omit<IconProps, "name"> & {
  name: LineiconsIconName;
};

const LineiconsIcon = ({ name, ...props }: LineiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LineiconsIcon, type LineiconsIconProps };
