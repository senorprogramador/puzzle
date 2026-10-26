import { Icon, type IconProps } from "../icon";
import type { UitIconName } from "./uit.types.ts";

const prefix = "uit" as const;

type UitIconProps = Omit<IconProps, "name"> & {
  name: UitIconName;
};

const UitIcon = ({ name, ...props }: UitIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { UitIcon, type UitIconProps };
