import { Icon, type IconProps } from "../icon";
import type { BoxiconsIconName } from "./boxicons.types.ts";

const prefix = "boxicons" as const;

type BoxiconsIconProps = Omit<IconProps, "name"> & {
  name: BoxiconsIconName;
};

const BoxiconsIcon = ({ name, ...props }: BoxiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BoxiconsIcon, type BoxiconsIconProps };
