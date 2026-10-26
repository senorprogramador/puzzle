import { Icon, type IconProps } from "../icon";
import type { IxIconName } from "./ix.types.ts";

const prefix = "ix" as const;

type IxIconProps = Omit<IconProps, "name"> & {
  name: IxIconName;
};

const IxIcon = ({ name, ...props }: IxIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IxIcon, type IxIconProps };
