import { Icon, type IconProps } from "../icon";
import type { BrandicoIconName } from "./brandico.types.ts";

const prefix = "brandico" as const;

type BrandicoIconProps = Omit<IconProps, "name"> & {
  name: BrandicoIconName;
};

const BrandicoIcon = ({ name, ...props }: BrandicoIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BrandicoIcon, type BrandicoIconProps };
