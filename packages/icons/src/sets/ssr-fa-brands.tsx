import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FaBrandsIconName } from "./fa-brands.types.ts";

const prefix = "fa-brands" as const;

type SSRFaBrandsIconProps = Omit<SSRIconProps, "name"> & {
  name: FaBrandsIconName;
};

const FaBrandsIcon = ({ name, ...props }: SSRFaBrandsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FaBrandsIcon, type SSRFaBrandsIconProps };
