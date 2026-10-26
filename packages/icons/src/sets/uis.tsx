import { Icon, type IconProps } from "../icon";
import type { UisIconName } from "./uis.types.ts";

const prefix = "uis" as const;

type UisIconProps = Omit<IconProps, "name"> & {
  name: UisIconName;
};

const UisIcon = ({ name, ...props }: UisIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { UisIcon, type UisIconProps };
