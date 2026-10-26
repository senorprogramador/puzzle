import { Icon, type IconProps } from "../icon";
import type { GravityUiIconName } from "./gravity-ui.types.ts";

const prefix = "gravity-ui" as const;

type GravityUiIconProps = Omit<IconProps, "name"> & {
  name: GravityUiIconName;
};

const GravityUiIcon = ({ name, ...props }: GravityUiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GravityUiIcon, type GravityUiIconProps };
