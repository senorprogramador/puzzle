import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CryptocurrencyColorIconName } from "./cryptocurrency-color.types.ts";

const prefix = "cryptocurrency-color" as const;

type SSRCryptocurrencyColorIconProps = Omit<SSRIconProps, "name"> & {
  name: CryptocurrencyColorIconName;
};

const CryptocurrencyColorIcon = ({ name, ...props }: SSRCryptocurrencyColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CryptocurrencyColorIcon, type SSRCryptocurrencyColorIconProps };
