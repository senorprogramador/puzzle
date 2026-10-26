import { Icon, type IconProps } from "../icon";
import type { NrkIconName } from "./nrk.types.ts";

const prefix = "nrk" as const;

type NrkIconProps = Omit<IconProps, "name"> & {
  name: NrkIconName;
};

const NrkIcon = ({ name, ...props }: NrkIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { NrkIcon, type NrkIconProps };
