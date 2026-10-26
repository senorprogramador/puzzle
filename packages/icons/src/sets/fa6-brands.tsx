import { Icon, type IconProps } from "../icon";
import type { Fa6BrandsIconName } from "./fa6-brands.types.ts";

const prefix = "fa6-brands" as const;

type Fa6BrandsIconProps = Omit<IconProps, "name"> & {
  name: Fa6BrandsIconName;
};

const Fa6BrandsIcon = ({ name, ...props }: Fa6BrandsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa6BrandsIcon, type Fa6BrandsIconProps };
