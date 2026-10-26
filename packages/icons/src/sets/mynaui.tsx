import { Icon, type IconProps } from "../icon";
import type { MynauiIconName } from "./mynaui.types.ts";

const prefix = "mynaui" as const;

type MynauiIconProps = Omit<IconProps, "name"> & {
  name: MynauiIconName;
};

const MynauiIcon = ({ name, ...props }: MynauiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MynauiIcon, type MynauiIconProps };
