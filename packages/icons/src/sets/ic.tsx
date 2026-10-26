import { Icon, type IconProps } from "../icon";
import type { IcIconName } from "./ic.types.ts";

const prefix = "ic" as const;

type IcIconProps = Omit<IconProps, "name"> & {
  name: IcIconName;
};

const IcIcon = ({ name, ...props }: IcIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IcIcon, type IcIconProps };
