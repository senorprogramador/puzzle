import { Icon, type IconProps } from "../icon";
import type { PajamasIconName } from "./pajamas.types.ts";

const prefix = "pajamas" as const;

type PajamasIconProps = Omit<IconProps, "name"> & {
  name: PajamasIconName;
};

const PajamasIcon = ({ name, ...props }: PajamasIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PajamasIcon, type PajamasIconProps };
