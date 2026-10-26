import { Icon, type IconProps } from "../icon";
import type { UiwIconName } from "./uiw.types.ts";

const prefix = "uiw" as const;

type UiwIconProps = Omit<IconProps, "name"> & {
  name: UiwIconName;
};

const UiwIcon = ({ name, ...props }: UiwIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { UiwIcon, type UiwIconProps };
