import { Icon, type IconProps } from "../icon";
import type { DashiconsIconName } from "./dashicons.types.ts";

const prefix = "dashicons" as const;

type DashiconsIconProps = Omit<IconProps, "name"> & {
  name: DashiconsIconName;
};

const DashiconsIcon = ({ name, ...props }: DashiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { DashiconsIcon, type DashiconsIconProps };
