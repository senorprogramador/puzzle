import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { Fa7BrandsIconName } from "./fa7-brands.types.ts";

const prefix = "fa7-brands" as const;

type SSRFa7BrandsIconProps = Omit<SSRIconProps, "name"> & {
  name: Fa7BrandsIconName;
};

const Fa7BrandsIcon = ({ name, ...props }: SSRFa7BrandsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa7BrandsIcon, type SSRFa7BrandsIconProps };
