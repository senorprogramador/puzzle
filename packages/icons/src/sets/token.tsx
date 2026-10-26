import { Icon, type IconProps } from "../icon";
import type { TokenIconName } from "./token.types.ts";

const prefix = "token" as const;

type TokenIconProps = Omit<IconProps, "name"> & {
  name: TokenIconName;
};

const TokenIcon = ({ name, ...props }: TokenIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TokenIcon, type TokenIconProps };
