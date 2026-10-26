import { Icon, type IconProps } from "../icon";
import type { IlIconName } from "./il.types.ts";

const prefix = "il" as const;

type IlIconProps = Omit<IconProps, "name"> & {
  name: IlIconName;
};

const IlIcon = ({ name, ...props }: IlIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IlIcon, type IlIconProps };
