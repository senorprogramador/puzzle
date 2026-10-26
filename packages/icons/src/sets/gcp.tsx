import { Icon, type IconProps } from "../icon";
import type { GcpIconName } from "./gcp.types.ts";

const prefix = "gcp" as const;

type GcpIconProps = Omit<IconProps, "name"> & {
  name: GcpIconName;
};

const GcpIcon = ({ name, ...props }: GcpIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GcpIcon, type GcpIconProps };
