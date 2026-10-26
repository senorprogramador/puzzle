import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PrimeIconName } from "./prime.types.ts";

const prefix = "prime" as const;

type SSRPrimeIconProps = Omit<SSRIconProps, "name"> & {
  name: PrimeIconName;
};

const PrimeIcon = ({ name, ...props }: SSRPrimeIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PrimeIcon, type SSRPrimeIconProps };
