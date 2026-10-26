import { Icon, type IconProps } from "../icon";
import type { TokenBrandedIconName } from "./token-branded.types.ts";

const prefix = "token-branded" as const;

type TokenBrandedIconProps = Omit<IconProps, "name"> & {
  name: TokenBrandedIconName;
};

const TokenBrandedIcon = ({ name, ...props }: TokenBrandedIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TokenBrandedIcon, type TokenBrandedIconProps };
