import { Icon, type IconProps } from "../icon";
import type { Fa7BrandsIconName } from "./fa7-brands.types.ts";

const prefix = "fa7-brands" as const;

type Fa7BrandsIconProps = Omit<IconProps, "name"> & {
  name: Fa7BrandsIconName;
};

const Fa7BrandsIcon = ({ name, ...props }: Fa7BrandsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa7BrandsIcon, type Fa7BrandsIconProps };
