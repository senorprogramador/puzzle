import { Icon, type IconProps } from "../icon";
import type { EiIconName } from "./ei.types.ts";

const prefix = "ei" as const;

type EiIconProps = Omit<IconProps, "name"> & {
  name: EiIconName;
};

const EiIcon = ({ name, ...props }: EiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EiIcon, type EiIconProps };
