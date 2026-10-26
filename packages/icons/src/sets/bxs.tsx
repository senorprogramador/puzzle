import { Icon, type IconProps } from "../icon";
import type { BxsIconName } from "./bxs.types.ts";

const prefix = "bxs" as const;

type BxsIconProps = Omit<IconProps, "name"> & {
  name: BxsIconName;
};

const BxsIcon = ({ name, ...props }: BxsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BxsIcon, type BxsIconProps };
