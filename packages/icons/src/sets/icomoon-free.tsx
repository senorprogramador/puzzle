import { Icon, type IconProps } from "../icon";
import type { IcomoonFreeIconName } from "./icomoon-free.types.ts";

const prefix = "icomoon-free" as const;

type IcomoonFreeIconProps = Omit<IconProps, "name"> & {
  name: IcomoonFreeIconName;
};

const IcomoonFreeIcon = ({ name, ...props }: IcomoonFreeIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IcomoonFreeIcon, type IcomoonFreeIconProps };
