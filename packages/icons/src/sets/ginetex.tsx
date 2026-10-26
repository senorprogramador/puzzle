import { Icon, type IconProps } from "../icon";
import type { GinetexIconName } from "./ginetex.types.ts";

const prefix = "ginetex" as const;

type GinetexIconProps = Omit<IconProps, "name"> & {
  name: GinetexIconName;
};

const GinetexIcon = ({ name, ...props }: GinetexIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GinetexIcon, type GinetexIconProps };
