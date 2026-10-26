import { Icon, type IconProps } from "../icon";
import type { UimIconName } from "./uim.types.ts";

const prefix = "uim" as const;

type UimIconProps = Omit<IconProps, "name"> & {
  name: UimIconName;
};

const UimIcon = ({ name, ...props }: UimIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { UimIcon, type UimIconProps };
