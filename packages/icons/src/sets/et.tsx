import { Icon, type IconProps } from "../icon";
import type { EtIconName } from "./et.types.ts";

const prefix = "et" as const;

type EtIconProps = Omit<IconProps, "name"> & {
  name: EtIconName;
};

const EtIcon = ({ name, ...props }: EtIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EtIcon, type EtIconProps };
