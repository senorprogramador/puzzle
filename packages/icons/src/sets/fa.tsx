import { Icon, type IconProps } from "../icon";
import type { FaIconName } from "./fa.types.ts";

const prefix = "fa" as const;

type FaIconProps = Omit<IconProps, "name"> & {
  name: FaIconName;
};

const FaIcon = ({ name, ...props }: FaIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FaIcon, type FaIconProps };
