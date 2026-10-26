import { Icon, type IconProps } from "../icon";
import type { RaphaelIconName } from "./raphael.types.ts";

const prefix = "raphael" as const;

type RaphaelIconProps = Omit<IconProps, "name"> & {
  name: RaphaelIconName;
};

const RaphaelIcon = ({ name, ...props }: RaphaelIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { RaphaelIcon, type RaphaelIconProps };
