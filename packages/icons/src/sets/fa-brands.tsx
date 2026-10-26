import { Icon, type IconProps } from "../icon";
import type { FaBrandsIconName } from "./fa-brands.types.ts";

const prefix = "fa-brands" as const;

type FaBrandsIconProps = Omit<IconProps, "name"> & {
  name: FaBrandsIconName;
};

const FaBrandsIcon = ({ name, ...props }: FaBrandsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FaBrandsIcon, type FaBrandsIconProps };
