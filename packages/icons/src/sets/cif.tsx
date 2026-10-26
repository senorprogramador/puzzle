import { Icon, type IconProps } from "../icon";
import type { CifIconName } from "./cif.types.ts";

const prefix = "cif" as const;

type CifIconProps = Omit<IconProps, "name"> & {
  name: CifIconName;
};

const CifIcon = ({ name, ...props }: CifIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CifIcon, type CifIconProps };
