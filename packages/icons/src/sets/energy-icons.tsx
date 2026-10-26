import { Icon, type IconProps } from "../icon";
import type { EnergyIconsIconName } from "./energy-icons.types.ts";

const prefix = "energy-icons" as const;

type EnergyIconsIconProps = Omit<IconProps, "name"> & {
  name: EnergyIconsIconName;
};

const EnergyIconsIcon = ({ name, ...props }: EnergyIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EnergyIconsIcon, type EnergyIconsIconProps };
