import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BitcoinIconsIconName } from "./bitcoin-icons.types.ts";

const prefix = "bitcoin-icons" as const;

type SSRBitcoinIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: BitcoinIconsIconName;
};

const BitcoinIconsIcon = ({ name, ...props }: SSRBitcoinIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BitcoinIconsIcon, type SSRBitcoinIconsIconProps };
