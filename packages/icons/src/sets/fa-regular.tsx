import { Icon, type IconProps } from "../icon";
import type { FaRegularIconName } from "./fa-regular.types.ts";

const prefix = "fa-regular" as const;

type FaRegularIconProps = Omit<IconProps, "name"> & {
  name: FaRegularIconName;
};

const FaRegularIcon = ({ name, ...props }: FaRegularIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FaRegularIcon, type FaRegularIconProps };
