import { Icon, type IconProps } from "../icon";
import type { SolarIconName } from "./solar.types.ts";

const prefix = "solar" as const;

type SolarIconProps = Omit<IconProps, "name"> & {
  name: SolarIconName;
};

const SolarIcon = ({ name, ...props }: SolarIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SolarIcon, type SolarIconProps };
