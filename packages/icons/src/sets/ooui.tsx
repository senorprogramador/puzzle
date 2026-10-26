import { Icon, type IconProps } from "../icon";
import type { OouiIconName } from "./ooui.types.ts";

const prefix = "ooui" as const;

type OouiIconProps = Omit<IconProps, "name"> & {
  name: OouiIconName;
};

const OouiIcon = ({ name, ...props }: OouiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { OouiIcon, type OouiIconProps };
