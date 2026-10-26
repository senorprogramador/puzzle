import { Icon, type IconProps } from "../icon";
import type { TeenyiconsIconName } from "./teenyicons.types.ts";

const prefix = "teenyicons" as const;

type TeenyiconsIconProps = Omit<IconProps, "name"> & {
  name: TeenyiconsIconName;
};

const TeenyiconsIcon = ({ name, ...props }: TeenyiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TeenyiconsIcon, type TeenyiconsIconProps };
