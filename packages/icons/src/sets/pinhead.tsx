import { Icon, type IconProps } from "../icon";
import type { PinheadIconName } from "./pinhead.types.ts";

const prefix = "pinhead" as const;

type PinheadIconProps = Omit<IconProps, "name"> & {
  name: PinheadIconName;
};

const PinheadIcon = ({ name, ...props }: PinheadIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PinheadIcon, type PinheadIconProps };
