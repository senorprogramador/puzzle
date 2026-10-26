import { Icon, type IconProps } from "../icon";
import type { ReiconIconName } from "./reicon.types.ts";

const prefix = "reicon" as const;

type ReiconIconProps = Omit<IconProps, "name"> & {
  name: ReiconIconName;
};

const ReiconIcon = ({ name, ...props }: ReiconIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ReiconIcon, type ReiconIconProps };
