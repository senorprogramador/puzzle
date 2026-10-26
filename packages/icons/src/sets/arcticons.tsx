import { Icon, type IconProps } from "../icon";
import type { ArcticonsIconName } from "./arcticons.types.ts";

const prefix = "arcticons" as const;

type ArcticonsIconProps = Omit<IconProps, "name"> & {
  name: ArcticonsIconName;
};

const ArcticonsIcon = ({ name, ...props }: ArcticonsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ArcticonsIcon, type ArcticonsIconProps };
