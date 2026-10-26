import { Icon, type IconProps } from "../icon";
import type { EpIconName } from "./ep.types.ts";

const prefix = "ep" as const;

type EpIconProps = Omit<IconProps, "name"> & {
  name: EpIconName;
};

const EpIcon = ({ name, ...props }: EpIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EpIcon, type EpIconProps };
