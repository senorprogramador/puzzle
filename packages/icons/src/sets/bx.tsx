import { Icon, type IconProps } from "../icon";
import type { BxIconName } from "./bx.types.ts";

const prefix = "bx" as const;

type BxIconProps = Omit<IconProps, "name"> & {
  name: BxIconName;
};

const BxIcon = ({ name, ...props }: BxIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BxIcon, type BxIconProps };
