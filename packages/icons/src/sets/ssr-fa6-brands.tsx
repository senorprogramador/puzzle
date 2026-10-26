import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { Fa6BrandsIconName } from "./fa6-brands.types.ts";

const prefix = "fa6-brands" as const;

type SSRFa6BrandsIconProps = Omit<SSRIconProps, "name"> & {
  name: Fa6BrandsIconName;
};

const Fa6BrandsIcon = ({ name, ...props }: SSRFa6BrandsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa6BrandsIcon, type SSRFa6BrandsIconProps };
