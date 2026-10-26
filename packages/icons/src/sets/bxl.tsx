import { Icon, type IconProps } from "../icon";
import type { BxlIconName } from "./bxl.types.ts";

const prefix = "bxl" as const;

type BxlIconProps = Omit<IconProps, "name"> & {
  name: BxlIconName;
};

const BxlIcon = ({ name, ...props }: BxlIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BxlIcon, type BxlIconProps };
