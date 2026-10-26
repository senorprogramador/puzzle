import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CryptocurrencyIconName } from "./cryptocurrency.types.ts";

const prefix = "cryptocurrency" as const;

type SSRCryptocurrencyIconProps = Omit<SSRIconProps, "name"> & {
  name: CryptocurrencyIconName;
};

const CryptocurrencyIcon = ({ name, ...props }: SSRCryptocurrencyIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CryptocurrencyIcon, type SSRCryptocurrencyIconProps };
