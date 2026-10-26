import { Icon, type IconProps } from "../icon";
import type { PrimeIconName } from "./prime.types.ts";

const prefix = "prime" as const;

type PrimeIconProps = Omit<IconProps, "name"> & {
  name: PrimeIconName;
};

const PrimeIcon = ({ name, ...props }: PrimeIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PrimeIcon, type PrimeIconProps };
