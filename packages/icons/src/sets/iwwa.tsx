import { Icon, type IconProps } from "../icon";
import type { IwwaIconName } from "./iwwa.types.ts";

const prefix = "iwwa" as const;

type IwwaIconProps = Omit<IconProps, "name"> & {
  name: IwwaIconName;
};

const IwwaIcon = ({ name, ...props }: IwwaIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IwwaIcon, type IwwaIconProps };
