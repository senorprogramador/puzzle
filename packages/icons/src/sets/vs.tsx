import { Icon, type IconProps } from "../icon";
import type { VsIconName } from "./vs.types.ts";

const prefix = "vs" as const;

type VsIconProps = Omit<IconProps, "name"> & {
  name: VsIconName;
};

const VsIcon = ({ name, ...props }: VsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { VsIcon, type VsIconProps };
