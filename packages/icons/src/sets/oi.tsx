import { Icon, type IconProps } from "../icon";
import type { OiIconName } from "./oi.types.ts";

const prefix = "oi" as const;

type OiIconProps = Omit<IconProps, "name"> & {
  name: OiIconName;
};

const OiIcon = ({ name, ...props }: OiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { OiIcon, type OiIconProps };
