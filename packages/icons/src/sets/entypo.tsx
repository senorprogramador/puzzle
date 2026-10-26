import { Icon, type IconProps } from "../icon";
import type { EntypoIconName } from "./entypo.types.ts";

const prefix = "entypo" as const;

type EntypoIconProps = Omit<IconProps, "name"> & {
  name: EntypoIconName;
};

const EntypoIcon = ({ name, ...props }: EntypoIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EntypoIcon, type EntypoIconProps };
