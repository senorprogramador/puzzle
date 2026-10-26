import { Icon, type IconProps } from "../icon";
import type { BiIconName } from "./bi.types.ts";

const prefix = "bi" as const;

type BiIconProps = Omit<IconProps, "name"> & {
  name: BiIconName;
};

const BiIcon = ({ name, ...props }: BiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BiIcon, type BiIconProps };
