import { Icon, type IconProps } from "../icon";
import type { DeviconIconName } from "./devicon.types.ts";

const prefix = "devicon" as const;

type DeviconIconProps = Omit<IconProps, "name"> & {
  name: DeviconIconName;
};

const DeviconIcon = ({ name, ...props }: DeviconIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { DeviconIcon, type DeviconIconProps };
