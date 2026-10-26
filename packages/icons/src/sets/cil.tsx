import { Icon, type IconProps } from "../icon";
import type { CilIconName } from "./cil.types.ts";

const prefix = "cil" as const;

type CilIconProps = Omit<IconProps, "name"> & {
  name: CilIconName;
};

const CilIcon = ({ name, ...props }: CilIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CilIcon, type CilIconProps };
