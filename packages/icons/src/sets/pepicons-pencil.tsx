import { Icon, type IconProps } from "../icon";
import type { PepiconsPencilIconName } from "./pepicons-pencil.types.ts";

const prefix = "pepicons-pencil" as const;

type PepiconsPencilIconProps = Omit<IconProps, "name"> & {
  name: PepiconsPencilIconName;
};

const PepiconsPencilIcon = ({ name, ...props }: PepiconsPencilIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PepiconsPencilIcon, type PepiconsPencilIconProps };
