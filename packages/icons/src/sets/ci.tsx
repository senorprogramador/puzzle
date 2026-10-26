import { Icon, type IconProps } from "../icon";
import type { CiIconName } from "./ci.types.ts";

const prefix = "ci" as const;

type CiIconProps = Omit<IconProps, "name"> & {
  name: CiIconName;
};

const CiIcon = ({ name, ...props }: CiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CiIcon, type CiIconProps };
