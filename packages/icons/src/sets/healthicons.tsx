import { Icon, type IconProps } from "../icon";
import type { HealthiconsIconName } from "./healthicons.types.ts";

const prefix = "healthicons" as const;

type HealthiconsIconProps = Omit<IconProps, "name"> & {
  name: HealthiconsIconName;
};

const HealthiconsIcon = ({ name, ...props }: HealthiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { HealthiconsIcon, type HealthiconsIconProps };
