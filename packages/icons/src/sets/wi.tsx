import { Icon, type IconProps } from "../icon";
import type { WiIconName } from "./wi.types.ts";

const prefix = "wi" as const;

type WiIconProps = Omit<IconProps, "name"> & {
  name: WiIconName;
};

const WiIcon = ({ name, ...props }: WiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { WiIcon, type WiIconProps };
