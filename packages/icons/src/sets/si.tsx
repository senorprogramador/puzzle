import { Icon, type IconProps } from "../icon";
import type { SiIconName } from "./si.types.ts";

const prefix = "si" as const;

type SiIconProps = Omit<IconProps, "name"> & {
  name: SiIconName;
};

const SiIcon = ({ name, ...props }: SiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SiIcon, type SiIconProps };
