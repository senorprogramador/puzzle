import { Icon, type IconProps } from "../icon";
import type { SimpleIconsIconName } from "./simple-icons.types.ts";

const prefix = "simple-icons" as const;

type SimpleIconsIconProps = Omit<IconProps, "name"> & {
  name: SimpleIconsIconName;
};

const SimpleIconsIcon = ({ name, ...props }: SimpleIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SimpleIconsIcon, type SimpleIconsIconProps };
