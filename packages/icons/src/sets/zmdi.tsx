import { Icon, type IconProps } from "../icon";
import type { ZmdiIconName } from "./zmdi.types.ts";

const prefix = "zmdi" as const;

type ZmdiIconProps = Omit<IconProps, "name"> & {
  name: ZmdiIconName;
};

const ZmdiIcon = ({ name, ...props }: ZmdiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ZmdiIcon, type ZmdiIconProps };
