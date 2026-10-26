import { Icon, type IconProps } from "../icon";
import type { MiIconName } from "./mi.types.ts";

const prefix = "mi" as const;

type MiIconProps = Omit<IconProps, "name"> & {
  name: MiIconName;
};

const MiIcon = ({ name, ...props }: MiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MiIcon, type MiIconProps };
