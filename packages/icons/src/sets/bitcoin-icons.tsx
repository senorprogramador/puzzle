import { Icon, type IconProps } from "../icon";
import type { BitcoinIconsIconName } from "./bitcoin-icons.types.ts";

const prefix = "bitcoin-icons" as const;

type BitcoinIconsIconProps = Omit<IconProps, "name"> & {
  name: BitcoinIconsIconName;
};

const BitcoinIconsIcon = ({ name, ...props }: BitcoinIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BitcoinIconsIcon, type BitcoinIconsIconProps };
