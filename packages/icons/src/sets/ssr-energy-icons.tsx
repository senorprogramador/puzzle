import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EnergyIconsIconName } from "./energy-icons.types.ts";

const prefix = "energy-icons" as const;

type SSREnergyIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: EnergyIconsIconName;
};

const EnergyIconsIcon = ({ name, ...props }: SSREnergyIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EnergyIconsIcon, type SSREnergyIconsIconProps };
