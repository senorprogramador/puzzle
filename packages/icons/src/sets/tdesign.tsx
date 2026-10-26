import { Icon, type IconProps } from "../icon";
import type { TdesignIconName } from "./tdesign.types.ts";

const prefix = "tdesign" as const;

type TdesignIconProps = Omit<IconProps, "name"> & {
  name: TdesignIconName;
};

const TdesignIcon = ({ name, ...props }: TdesignIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TdesignIcon, type TdesignIconProps };
