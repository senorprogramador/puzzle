import { Icon, type IconProps } from "../icon";
import type { MajesticonsIconName } from "./majesticons.types.ts";

const prefix = "majesticons" as const;

type MajesticonsIconProps = Omit<IconProps, "name"> & {
  name: MajesticonsIconName;
};

const MajesticonsIcon = ({ name, ...props }: MajesticonsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MajesticonsIcon, type MajesticonsIconProps };
