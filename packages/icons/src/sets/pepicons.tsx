import { Icon, type IconProps } from "../icon";
import type { PepiconsIconName } from "./pepicons.types.ts";

const prefix = "pepicons" as const;

type PepiconsIconProps = Omit<IconProps, "name"> & {
  name: PepiconsIconName;
};

const PepiconsIcon = ({ name, ...props }: PepiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PepiconsIcon, type PepiconsIconProps };
