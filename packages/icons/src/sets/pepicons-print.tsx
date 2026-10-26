import { Icon, type IconProps } from "../icon";
import type { PepiconsPrintIconName } from "./pepicons-print.types.ts";

const prefix = "pepicons-print" as const;

type PepiconsPrintIconProps = Omit<IconProps, "name"> & {
  name: PepiconsPrintIconName;
};

const PepiconsPrintIcon = ({ name, ...props }: PepiconsPrintIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PepiconsPrintIcon, type PepiconsPrintIconProps };
