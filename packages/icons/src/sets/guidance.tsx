import { Icon, type IconProps } from "../icon";
import type { GuidanceIconName } from "./guidance.types.ts";

const prefix = "guidance" as const;

type GuidanceIconProps = Omit<IconProps, "name"> & {
  name: GuidanceIconName;
};

const GuidanceIcon = ({ name, ...props }: GuidanceIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GuidanceIcon, type GuidanceIconProps };
