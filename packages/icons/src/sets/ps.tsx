import { Icon, type IconProps } from "../icon";
import type { PsIconName } from "./ps.types.ts";

const prefix = "ps" as const;

type PsIconProps = Omit<IconProps, "name"> & {
  name: PsIconName;
};

const PsIcon = ({ name, ...props }: PsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PsIcon, type PsIconProps };
