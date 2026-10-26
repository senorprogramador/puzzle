import { Icon, type IconProps } from "../icon";
import type { CryptocurrencyColorIconName } from "./cryptocurrency-color.types.ts";

const prefix = "cryptocurrency-color" as const;

type CryptocurrencyColorIconProps = Omit<IconProps, "name"> & {
  name: CryptocurrencyColorIconName;
};

const CryptocurrencyColorIcon = ({ name, ...props }: CryptocurrencyColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CryptocurrencyColorIcon, type CryptocurrencyColorIconProps };
