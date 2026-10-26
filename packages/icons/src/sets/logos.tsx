import { Icon, type IconProps } from "../icon";
import type { LogosIconName } from "./logos.types.ts";

const prefix = "logos" as const;

type LogosIconProps = Omit<IconProps, "name"> & {
  name: LogosIconName;
};

const LogosIcon = ({ name, ...props }: LogosIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LogosIcon, type LogosIconProps };
