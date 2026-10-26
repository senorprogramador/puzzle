import { Icon, type IconProps } from "../icon";
import type { CryptocurrencyIconName } from "./cryptocurrency.types.ts";

const prefix = "cryptocurrency" as const;

type CryptocurrencyIconProps = Omit<IconProps, "name"> & {
  name: CryptocurrencyIconName;
};

const CryptocurrencyIcon = ({ name, ...props }: CryptocurrencyIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CryptocurrencyIcon, type CryptocurrencyIconProps };
