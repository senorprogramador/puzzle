import { Icon, type IconProps } from "../icon";
import type { WeuiIconName } from "./weui.types.ts";

const prefix = "weui" as const;

type WeuiIconProps = Omit<IconProps, "name"> & {
  name: WeuiIconName;
};

const WeuiIcon = ({ name, ...props }: WeuiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { WeuiIcon, type WeuiIconProps };
