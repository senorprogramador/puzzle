import { Icon, type IconProps } from "../icon";
import type { SystemUiconsIconName } from "./system-uicons.types.ts";

const prefix = "system-uicons" as const;

type SystemUiconsIconProps = Omit<IconProps, "name"> & {
  name: SystemUiconsIconName;
};

const SystemUiconsIcon = ({ name, ...props }: SystemUiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SystemUiconsIcon, type SystemUiconsIconProps };
